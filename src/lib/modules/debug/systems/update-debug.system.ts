import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { debugState } from "$lib/adapters/ui-state/debug-state.svelte";

export function createUpdateDebugSystem(world: World<Entity>) {
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
