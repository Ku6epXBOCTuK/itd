import { IncomeSystem } from "$lib/modules/economy/systems/income.system";
import { SyncRenderSystem } from "$lib/modules/render/systems/sync-render.system";
import { MoveSystem } from "$lib/modules/enemies/systems/move.system";
import { AttackSystem } from "$lib/modules/enemies/systems/attack.system";
import { TowerAttackSystem } from "$lib/modules/towers/systems/attack.system";
import { TargetingSystem } from "$lib/modules/projectiles/systems/targeting.system";
import { HomingMovementSystem } from "$lib/modules/projectiles/systems/homing-movement.system";
import { BallisticMovementSystem } from "$lib/modules/projectiles/systems/ballistic-movement.system";
import { CollisionSystem } from "$lib/modules/projectiles/systems/collision.system";
import {
	WaveSystem,
	SpawnSystem,
} from "$lib/modules/waves/systems/respawn.system";
import { UpdateHudSystem } from "$lib/modules/hud/systems/update-hud.system";
import { FpsSystem } from "$lib/modules/debug/systems/fps.system";
import { UpdateDebugSystem } from "$lib/modules/debug/systems/update-debug.system";
import { EnemyDeathSystem } from "$lib/modules/enemies/systems/enemy-death.system";
import { appState, AppState } from "$lib/core/app-state.svelte";
import { FRAME_MS, SECOND_MS } from "$lib/core/constants";

type System = (deltaTime: number) => void;

const ActiveSystems: System[] = [AttackSystem, WaveSystem, SpawnSystem];
const GameSystems: System[] = [MoveSystem, TowerAttackSystem, EnemyDeathSystem];
const ProjectileSystems: System[] = [
	TargetingSystem,
	HomingMovementSystem,
	BallisticMovementSystem,
	CollisionSystem,
];
const SecondTickSystems: System[] = [IncomeSystem];
const FrameSystems: System[] = [
	SyncRenderSystem,
	UpdateHudSystem,
	FpsSystem,
	UpdateDebugSystem,
];

let isRunning = false;
let animationFrameId: number | null = null;
let secondTickTimer = 0;

function gameLoop(deltaTime: number) {
	if (appState.current === AppState.PLAYING) {
		for (const system of ActiveSystems) {
			system(deltaTime);
		}

		for (const system of GameSystems) {
			system(deltaTime);
		}

		for (const system of ProjectileSystems) {
			system(deltaTime);
		}
	}

	if (appState.current === AppState.GAME_OVER_ANIMATING) {
		for (const system of ProjectileSystems) {
			system(deltaTime);
		}
	}

	secondTickTimer += deltaTime;
	if (secondTickTimer >= SECOND_MS) {
		const ticks = Math.floor(secondTickTimer / SECOND_MS);
		secondTickTimer %= SECOND_MS;

		for (let i = 0; i < ticks; i++) {
			for (const system of SecondTickSystems) {
				system(SECOND_MS);
			}
		}
	}

	for (const system of FrameSystems) {
		system(deltaTime);
	}
}

function loop(_timestamp: number) {
	if (!isRunning) return;

	gameLoop(FRAME_MS);
	animationFrameId = requestAnimationFrame(loop);
}

export const GameLoop = {
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
};
