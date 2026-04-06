import type { BaseContext } from "$lib/modules/shared/context";
import { GAME_CONFIG } from "$lib/core/game-config";
import { PERCENT } from "$lib/core/constants";

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
		}
	};
}
