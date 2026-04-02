import { world } from "$lib/core/world";
import { debugState } from "$lib/adapters/ui-state/debug-state.svelte";

export const UpdateDebugSystem = (_deltaTime: number) => {
	debugState.enemyCount = world.with("enemy").size;
	debugState.projectileCount = world.with("projectile").size;
};
