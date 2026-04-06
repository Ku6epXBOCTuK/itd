import type { BaseContext } from "$lib/modules/shared/context";

export function createAttackCooldownSystem(ctx: BaseContext) {
	const onCooldown = ctx.world.with("attackCooldownTimer");

	return (dt: number) => {
		for (const entity of onCooldown) {
			entity.attackCooldownTimer -= dt;

			if (entity.attackCooldownTimer <= 0) {
				ctx.world.removeComponent(entity, "attackCooldownTimer");
			}
		}
	};
}
