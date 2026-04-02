import { world } from "$lib/core/world";
import { SECOND_MS } from "$lib/core/constants";
import { debugState } from "$lib/adapters/ui-state/debug-state.svelte";

let frameCount = 0;
let lastFpsUpdate = 0;

export const UpdateDebugSystem = () => {
	const now = performance.now();
	frameCount++;

	if (now - lastFpsUpdate >= SECOND_MS) {
		debugState.fps = frameCount;
		debugState.enemyCount = Array.from(world.with("enemy")).length;
		debugState.projectileCount = Array.from(world.with("projectile")).length;
		frameCount = 0;
		lastFpsUpdate = now;
	}
};
