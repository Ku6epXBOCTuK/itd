import type { BaseContext } from "$lib/modules/shared/context";
import { SECOND_MS } from "$lib/core/constants";

export function createMovementSystem(ctx: BaseContext) {
	const movable = ctx.world.with("velocity", "position");

	return (dt: number) => {
		for (const entity of movable) {
			const v = entity.velocity;
			entity.position.x += (v.x * dt) / SECOND_MS;
			entity.position.y += (v.y * dt) / SECOND_MS;
			entity.position.z += (v.z * dt) / SECOND_MS;
		}
	};
}
