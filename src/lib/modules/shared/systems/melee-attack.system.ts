import type { BaseContext } from "$lib/modules/shared/context";
import { AttackVariant } from "$lib/modules/shared/components";

export function createMeleeAttackSystem(ctx: BaseContext) {
	const attackers = ctx.world.with("executeAttack");

	return () => {
		for (const entity of attackers) {
			const executeAttack = entity.executeAttack;
			if (!executeAttack) continue;

			if (executeAttack.attackVariant !== AttackVariant.MELEE) continue;

			const target = executeAttack.target;
			if (
				target &&
				ctx.world.has(target) &&
				target.targetableTag &&
				(target.hp ?? 0) > 0
			) {
				target.hp = Math.max(0, (target.hp ?? 0) - executeAttack.damage);
			}
		}
	};
}
