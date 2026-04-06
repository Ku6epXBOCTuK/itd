import { debugState } from "$lib/adapters/ui-state/debug-state.svelte";
import { FPS_HISTORY_SIZE, SECOND_MS } from "$lib/core/constants";
import type { BaseContext } from "$lib/modules/shared/context";

export function createFpsSystem(_ctx: BaseContext) {
	return (dt: number) => {
		const currentFps = Math.round(SECOND_MS / dt);
		debugState.fpsHistory.push(currentFps);
		if (debugState.fpsHistory.length > FPS_HISTORY_SIZE) {
			debugState.fpsHistory.shift();
		}

		debugState.fps = currentFps;
	};
}
