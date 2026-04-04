import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { SECOND_MS } from "$lib/core/constants";

export function createMovementSystem(world: World<Entity>) {
	const movable = world.with("position", "velocity");

	return (dt: number) => {
		for (const entity of movable) {
			const v = entity.velocity;
			entity.position.x += v.x * (dt / SECOND_MS);
			entity.position.y += v.y * (dt / SECOND_MS);
			entity.position.z += v.z * (dt / SECOND_MS);
		}
	};
}
