import { SECOND_MS, FPS_HISTORY_SIZE } from "$lib/core/constants";
import { debugState } from "$lib/adapters/ui-state/debug-state.svelte";

export const createFpsSystem = () => {
	return (dt: number) => {
		const currentFps = Math.round(SECOND_MS / dt);
		debugState.fpsHistory.push(currentFps);
		if (debugState.fpsHistory.length > FPS_HISTORY_SIZE) {
			debugState.fpsHistory.shift();
		}

		debugState.fps = currentFps;
	};
};
