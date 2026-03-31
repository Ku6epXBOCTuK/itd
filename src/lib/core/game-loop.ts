import { IncomeSystem } from "$lib/modules/economy/systems/income.system";
import { SyncRenderSystem } from "$lib/modules/render/systems/sync-render.system";
import { MoveSystem } from "$lib/modules/enemies/systems/move.system";
import { AttackSystem } from "$lib/modules/enemies/systems/attack.system";
import { getAppState, AppState } from "./world";

type GameplaySystem = (deltaTime: number) => void;
type RenderSystem = () => void;

const InGameSystems: GameplaySystem[] = [IncomeSystem, MoveSystem, AttackSystem];
const AlwaysSystems: RenderSystem[] = [SyncRenderSystem];

let isRunning = false;
let animationFrameId: number | null = null;

function gameLoop(deltaTime: number) {
	const state = getAppState();

	if (state === AppState.IN_GAME) {
		for (const system of InGameSystems) {
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
