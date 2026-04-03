import { world } from "$lib/core/world";
import { debugState } from "$lib/adapters/ui-state/debug-state.svelte";

export const createUpdateDebugSystem = () => {
	const enemiesQuery = world.with("isEnemy");
	const projectilesQuery = world.with("isProjectile");

	return (_dt: number) => {
		debugState.enemyCount = enemiesQuery.size;
		debugState.projectileCount = projectilesQuery.size;
	};
};
