import { IncomeSystem } from "$lib/modules/economy/system/income.system";
import { SyncRenderSystem } from "$lib/modules/render/systems/sync-render.system";

const systems = [IncomeSystem, SyncRenderSystem];

let isRunning = false;
let animationFrameId: number | null = null;

function gameLoop(deltaTime: number) {
	for (const system of systems) {
		system(deltaTime);
	}
}

function loop(timestamp: number) {
	if (!isRunning) return;

	gameLoop(16); // пока фиксированный delta, можно улучшить до расчета реального deltaTime
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
