import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { createIncomeSystem } from "$lib/modules/player/systems/income.system";
import { createSyncRenderSystem } from "$lib/modules/render/systems/render.system";
import { createMovementSystem } from "$lib/modules/physics/systems/movement.system";
import { createFrictionSystem } from "$lib/modules/physics/systems/friction.system";
import { createEnemyAISystem } from "$lib/modules/enemies/systems/ai.system";
import { createTowerAISystem } from "$lib/modules/towers/systems/ai.system";
import { createAttackSystem } from "$lib/modules/shared/systems/attack.system";
import { createAttackCooldownSystem } from "$lib/modules/shared/systems/attack-cooldown.system";
import { createMeleeAttackSystem } from "$lib/modules/enemies/systems/melee-attack.system";
import { createProjectileAttackSystem } from "$lib/modules/towers/systems/projectile-attack.system";
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
import { FRAME_MS, SECOND_MS } from "$lib/core/constants";

type System = (deltaTime: number) => void;
type SystemFactory = (world: World<Entity>) => System;

const SECOND_TICK_FACTORIES: SystemFactory[] = [createIncomeSystem];

const TICK_START_FACTORIES: SystemFactory[] = [
	createWaveSystem,
	createEnemySpawnSystem,
	createEnemyAISystem,
	createTowerAISystem,
	createAttackSystem,
	createAttackCooldownSystem,
	createMeleeAttackSystem,
	createProjectileAttackSystem,
	createMovementSystem,
	createFrictionSystem,
	createTowerDeathSystem,
	createTargetingSystem,
	createHomingMovementSystem,
	createBallisticMovementSystem,
	createCollisionSystem,
	createDeathCheckSystem,
	createEnemyDeathSystem,
	createApplyUpgradesSystem,
	createAnimationStateSystem,
	createGameOverTimerSystem,
];

const UI_SYSTEM_FACTORIES: SystemFactory[] = [
	createUpdateHudSystem,
	createFpsSystem,
	createUpdateDebugSystem,
];

const TICK_END_FACTORIES: SystemFactory[] = [createCleanupSystem];

export function createGameLoop(world: World<Entity>) {
	const secondTickSystems = SECOND_TICK_FACTORIES.map((factory) =>
		factory(world),
	);
	const tickStartSystems = TICK_START_FACTORIES.map((factory) =>
		factory(world),
	);
	const uiSystems = UI_SYSTEM_FACTORIES.map((factory) => factory(world));
	const tickEndSystems = TICK_END_FACTORIES.map((factory) => factory(world));

	let isRunning = false;
	let animationFrameId: number | null = null;
	let secondTickTimer = 0;

	function gameLoop(deltaTime: number) {
		secondTickTimer += deltaTime;
		if (secondTickTimer >= SECOND_MS) {
			const ticks = Math.floor(secondTickTimer / SECOND_MS);
			secondTickTimer %= SECOND_MS;

			for (let i = 0; i < ticks; i++) {
				for (const system of secondTickSystems) {
					system(SECOND_MS);
				}
			}
		}

		for (const system of tickStartSystems) {
			system(deltaTime);
		}

		for (const system of uiSystems) {
			system(deltaTime);
		}

		for (const system of tickEndSystems) {
			system(deltaTime);
		}
	}

	function loop(_timestamp: number) {
		if (!isRunning) return;

		gameLoop(FRAME_MS);
		animationFrameId = requestAnimationFrame(loop);
	}

	return {
		start(canvas: HTMLCanvasElement) {
			if (isRunning) return;

			uiSystems.push(createSyncRenderSystem(world, canvas));

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
	};
}
