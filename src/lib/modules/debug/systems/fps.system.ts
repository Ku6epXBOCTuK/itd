import { SECOND_MS, FPS_HISTORY_SIZE } from "$lib/core/constants";
import { debugState } from "$lib/adapters/ui-state/debug-state.svelte";

export const FpsSystem = (deltaTime: number) => {
	const currentFps = Math.round(SECOND_MS / deltaTime);
	debugState.fpsHistory.push(currentFps);
	if (debugState.fpsHistory.length > FPS_HISTORY_SIZE) {
		debugState.fpsHistory.shift();
	}

	debugState.fps = currentFps;
};
