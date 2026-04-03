import { createIncomeSystem } from "$lib/modules/economy/systems/income.system";
import { SyncRenderSystem } from "$lib/modules/render/systems/sync-render.system";
import { createMoveSystem } from "$lib/modules/enemies/systems/move.system";
import { createAttackSystem } from "$lib/modules/enemies/systems/attack.system";
import { createTowerAttackSystem } from "$lib/modules/towers/systems/attack.system";
import { createTargetingSystem } from "$lib/modules/projectiles/systems/targeting.system";
import { createHomingMovementSystem } from "$lib/modules/projectiles/systems/homing-movement.system";
import { createBallisticMovementSystem } from "$lib/modules/projectiles/systems/ballistic-movement.system";
import { createCollisionSystem } from "$lib/modules/projectiles/systems/collision.system";
import { createWaveSystem } from "$lib/modules/waves/systems/wave.system";
import { createSpawnSystem } from "$lib/modules/waves/systems/spawn.system";
import { createUpdateHudSystem } from "$lib/modules/hud/systems/update-hud.system";
import { createFpsSystem } from "$lib/modules/debug/systems/fps.system";
import { createUpdateDebugSystem } from "$lib/modules/debug/systems/update-debug.system";
import { createApplyUpgradesSystem } from "$lib/modules/upgrades/systems/apply-upgrades.system";
import { createEnemyDeathSystem } from "$lib/modules/enemies/systems/enemy-death.system";
import { appState, AppState } from "$lib/core/app-state.svelte";
import { FRAME_MS, SECOND_MS } from "$lib/core/constants";

type System = (deltaTime: number) => void;

const ActiveSystems: System[] = [
	createAttackSystem(),
	createWaveSystem(),
	createSpawnSystem(),
];
const GameSystems: System[] = [
	createMoveSystem(),
	createTowerAttackSystem(),
	createEnemyDeathSystem(),
	createApplyUpgradesSystem(),
];
const ProjectileSystems: System[] = [
	createTargetingSystem(),
	createHomingMovementSystem(),
	createBallisticMovementSystem(),
	createCollisionSystem(),
];
const SecondTickSystems: System[] = [createIncomeSystem()];
const FrameSystems: System[] = [
	SyncRenderSystem,
	createUpdateHudSystem(),
	createFpsSystem(),
	createUpdateDebugSystem(),
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
