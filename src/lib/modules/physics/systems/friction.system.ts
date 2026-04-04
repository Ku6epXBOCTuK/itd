import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";

export function createFrictionSystem(world: World<Entity>) {
	const withFriction = world.with("velocity", "friction");

	return (_dt: number) => {
		for (const entity of withFriction) {
			entity.velocity.x *= entity.friction;
			entity.velocity.y *= entity.friction;
			entity.velocity.z *= entity.friction;
		}
	};
}
