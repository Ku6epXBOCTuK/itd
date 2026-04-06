import { debugState } from "$lib/adapters/ui-state/debug-state.svelte";
import type { BaseContext } from "$lib/modules/shared/context";

export function createUpdateDebugSystem(ctx: BaseContext) {
	const world = ctx.world;
	const enemiesQuery = world.with("enemyTag");
	const projectilesQuery = world.with("projectileTag");
	const towersQuery = world.with("towerTag", "damage");

	return (_dt: number) => {
		debugState.enemyCount = enemiesQuery.size;
		debugState.projectileCount = projectilesQuery.size;

		const tower = towersQuery.first;
		debugState.towerDamage = tower ? tower.damage : 0;
	};
}
