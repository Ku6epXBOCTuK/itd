import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";

export function createCleanupSystem(world: World<Entity>) {
	const withExecuteAttack = world.with("executeAttack");

	return () => {
		for (const entity of withExecuteAttack) {
			world.removeComponent(entity, "executeAttack");
		}
	};
}
