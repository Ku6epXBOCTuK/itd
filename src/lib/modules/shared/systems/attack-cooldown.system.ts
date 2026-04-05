import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";

export function createAttackCooldownSystem(world: World<Entity>) {
	const onCooldown = world.with("attackCooldownTimer");

	return (dt: number) => {
		for (const entity of onCooldown) {
			entity.attackCooldownTimer -= dt;

			if (entity.attackCooldownTimer <= 0) {
				world.removeComponent(entity, "attackCooldownTimer");
			}
		}
	};
}
