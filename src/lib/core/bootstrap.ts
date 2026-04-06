import { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { GameEngine } from "$lib/core/event-bus";
import { FRAME_MS, SECOND_MS } from "$lib/core/constants";
import { setupScene } from "$lib/modules/render/systems/setup-scene";
import type { RenderContext } from "$lib/modules/shared/context";
import { WaveStatus } from "$lib/core/world";
import { GAME_CONFIG } from "$lib/core/game-config";
import { createPlayer } from "$lib/modules/player/factory";
import { createTower } from "$lib/modules/towers/factory";
import * as THREE from "three";

import { createIncomeSystem } from "$lib/modules/player/systems/income.system";
import { createMovementSystem } from "$lib/modules/physics/systems/movement.system";
import { createFrictionSystem } from "$lib/modules/physics/systems/friction.system";
import { createEnemyAISystem } from "$lib/modules/enemies/systems/ai.system";
import { createTowerAISystem } from "$lib/modules/towers/systems/ai.system";
import { createAttackSystem } from "$lib/modules/shared/systems/attack.system";
import { createAttackCooldownSystem } from "$lib/modules/shared/systems/attack-cooldown.system";
import { createMeleeAttackSystem } from "$lib/modules/shared/systems/melee-attack.system";
import { createProjectileAttackSystem } from "$lib/modules/shared/systems/projectile-attack.system";
import { createTargetingSystem } from "$lib/modules/projectiles/systems/targeting.system";
import { createHomingMovementSystem } from "$lib/modules/projectiles/systems/homing-movement.system";
import { createBallisticMovementSystem } from "$lib/modules/projectiles/systems/ballistic-movement.system";
import { createCollisionSystem } from "$lib/modules/projectiles/systems/collision.system";
import { createWaveSystem } from "$lib/modules/waves/systems/wave.system";
import { createEnemySpawnSystem } from "$lib/modules/waves/systems/enemy-spawn.system";
import { createUpdateHudSystem } from "$lib/modules/hud/systems/update-hud.system";
import { createFpsSystem } from "$lib/modules/debug/systems/fps.system";
import { createUpdateDebugSystem } from "$lib/modules/debug/systems/update-debug.system";
import { createApplyUpgradesSystem } from "$lib/modules/upgrades/systems/apply-upgrades.system";
import { createDeathCheckSystem } from "$lib/modules/enemies/systems/death-check.system";
import { createEnemyDeathSystem } from "$lib/modules/enemies/systems/death.system";
import { createAnimationStateSystem } from "$lib/modules/enemies/systems/animation-state.system";
import { createTowerDeathSystem } from "$lib/modules/towers/systems/tower-death.system";
import { createGameOverTimerSystem } from "$lib/modules/game-over/systems/game-over-timer.system";
import { createCleanupSystem } from "$lib/modules/shared/systems/cleanup.system";
import { createSyncRenderSystem } from "$lib/modules/render/systems/render.system";

type System = (dt: number) => void;
type SystemFactory = (ctx: RenderContext) => System;

function withThrottle(
	intervalMs: number,
	factory: SystemFactory,
): SystemFactory {
	return (ctx) => {
		const system = factory(ctx);
		let accumulator = 0;

		return (dt: number) => {
			accumulator += dt;
			if (accumulator >= intervalMs) {
				const ticks = Math.floor(accumulator / intervalMs);
				accumulator %= intervalMs;
				for (let i = 0; i < ticks; i++) {
					system(intervalMs);
				}
			}
		};
	};
}

type SystemGroup = { name: string; factories: SystemFactory[] };

const SYSTEM_GROUPS: SystemGroup[] = [
	{
		name: "prepare",
		factories: [
			createWaveSystem,
			createEnemySpawnSystem,
			createApplyUpgradesSystem,
		],
	},
	{
		name: "ai",
		factories: [createEnemyAISystem, createTowerAISystem],
	},
	{
		name: "attack",
		factories: [
			createAttackSystem,
			createAttackCooldownSystem,
			createMeleeAttackSystem,
			createProjectileAttackSystem,
		],
	},
	{
		name: "physics",
		factories: [createMovementSystem, createFrictionSystem],
	},
	{
		name: "projectiles",
		factories: [
			createTargetingSystem,
			createHomingMovementSystem,
			createBallisticMovementSystem,
			createCollisionSystem,
		],
	},
	{
		name: "death",
		factories: [
			createTowerDeathSystem,
			createDeathCheckSystem,
			createEnemyDeathSystem,
		],
	},
	{
		name: "update",
		factories: [
			createAnimationStateSystem,
			createGameOverTimerSystem,
			withThrottle(SECOND_MS, createIncomeSystem),
		],
	},
	{
		name: "ui",
		factories: [
			createUpdateHudSystem,
			createFpsSystem,
			createUpdateDebugSystem,
			createSyncRenderSystem,
		],
	},
	{
		name: "cleanup",
		factories: [createCleanupSystem],
	},
];

function createResizeObserver(
	canvas: HTMLCanvasElement,
	renderer: THREE.WebGLRenderer,
	camera: THREE.PerspectiveCamera,
) {
	return new ResizeObserver((_entries) => {
		const { width, height } = canvas.getBoundingClientRect();
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	});
}

function createInitialState(world: World<Entity>) {
	createPlayer(world);
	createTower(world, 0, 0);
	world.add({
		waveControl: {
			waveControl: true,
			currentWave: GAME_CONFIG.initialWave,
			status: WaveStatus.PREPARING,
			spawnTimer: 0,
			remainingEnemies: 0,
			waveDelayTimer: 0,
		},
	});
}

export function bootstrapGame(canvas: HTMLCanvasElement) {
	const world = new World<Entity>();

	createInitialState(world);

	const { scene, camera, renderer } = setupScene(canvas);
	createResizeObserver(canvas, renderer, camera).observe(canvas);

	const ctx: RenderContext = {
		world,
		scene,
		camera,
		renderer,
		eventBus: GameEngine,
	};

	const groups = SYSTEM_GROUPS.map((group) =>
		group.factories.map((factory) => factory(ctx)),
	);

	let isRunning = false;
	let animationFrameId: number | null = null;
	let lastTime = 0;

	function gameLoop(dt: number) {
		for (const group of groups) {
			for (const system of group) {
				system(dt);
			}
		}
	}

	function loop(timestamp: number) {
		if (!isRunning) return;

		const dt = lastTime ? timestamp - lastTime : FRAME_MS;
		lastTime = timestamp;

		gameLoop(dt);
		animationFrameId = requestAnimationFrame(loop);
	}

	return {
		start() {
			if (isRunning) return;
			isRunning = true;
			animationFrameId = requestAnimationFrame(loop);
		},

		stop() {
			isRunning = false;
			if (animationFrameId !== null) {
				cancelAnimationFrame(animationFrameId);
				animationFrameId = null;
			}
		},

		isRunning() {
			return isRunning;
		},

		reset() {
			world.clear();
			createInitialState(world);
		},
	};
}
