import type { BaseContext } from "$lib/modules/shared/context";

export function createCleanupSystem(ctx: BaseContext) {
	const world = ctx.world;
	const withExecuteAttack = world.with("executeAttack");

	return () => {
		for (const entity of withExecuteAttack) {
			world.removeComponent(entity, "executeAttack");
		}
	};
}
