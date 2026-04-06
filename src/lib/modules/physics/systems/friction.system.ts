import { PERCENT, VELOCITY_EPSILON } from "$lib/core/constants";
import { GAME_CONFIG } from "$lib/core/game-config";
import type { BaseContext } from "$lib/modules/shared/context";

export function createFrictionSystem(ctx: BaseContext) {
	const withFriction = ctx.world.with("velocity", "friction");

	return (_dt: number) => {
		for (const entity of withFriction) {
			const isAlive = !entity.dyingTag;
			const frictionValue = isAlive
				? entity.friction * GAME_CONFIG.aliveFrictionModifier
				: entity.friction;
			const multiplier = 1 - frictionValue / PERCENT;

			entity.velocity.x *= multiplier;
			entity.velocity.y *= multiplier;
			entity.velocity.z *= multiplier;

			if (Math.abs(entity.velocity.x) < VELOCITY_EPSILON) entity.velocity.x = 0;
			if (Math.abs(entity.velocity.y) < VELOCITY_EPSILON) entity.velocity.y = 0;
			if (Math.abs(entity.velocity.z) < VELOCITY_EPSILON) entity.velocity.z = 0;
		}
	};
}
