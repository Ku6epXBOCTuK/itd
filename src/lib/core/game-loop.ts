import { IncomeSystem } from "$lib/modules/economy/systems/income.system";
import { SyncRenderSystem } from "$lib/modules/render/systems/sync-render.system";
import { MoveSystem } from "$lib/modules/enemies/systems/move.system";
import { AttackSystem } from "$lib/modules/enemies/systems/attack.system";
import { TowerAttackSystem } from "$lib/modules/towers/system/attack.system";
import { ProjectileMoveSystem } from "$lib/modules/projectiles/systems/move.system";
import { HitSystem } from "$lib/modules/projectiles/systems/hit.system";
import { RespawnSystem } from "$lib/modules/waves/systems/respawn.system";
import { getAppState, AppState } from "./world";

type GameplaySystem = (deltaTime: number) => void;
type RenderSystem = () => void;

const ActiveGameSystems: GameplaySystem[] = [AttackSystem, RespawnSystem];
const GameplaySystems: GameplaySystem[] = [IncomeSystem, MoveSystem, TowerAttackSystem];
const ProjectileSystems: GameplaySystem[] = [ProjectileMoveSystem, HitSystem];
const AlwaysSystems: RenderSystem[] = [SyncRenderSystem];

let isRunning = false;
let animationFrameId: number | null = null;

function gameLoop(deltaTime: number) {
	const state = getAppState();

	if (state === AppState.ACTIVE_GAME) {
		for (const system of ActiveGameSystems) {
			system(deltaTime);
		}

		for (const system of GameplaySystems) {
			system(deltaTime);
		}

		for (const system of ProjectileSystems) {
			system(deltaTime);
		}
	}

	if (state === AppState.GAME_OVER_ANIMATING) {
		for (const system of ProjectileSystems) {
			system(deltaTime);
		}
	}

	for (const system of AlwaysSystems) {
		system();
	}
}

function loop(timestamp: number) {
	if (!isRunning) return;

	gameLoop(16);
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
