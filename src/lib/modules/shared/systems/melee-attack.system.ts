import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { AttackVariant } from "$lib/modules/shared/components";

export function createMeleeAttackSystem(world: World<Entity>) {
	const attackers = world.with("executeAttack");

	return () => {
		for (const entity of attackers) {
			const executeAttack = entity.executeAttack;
			if (!executeAttack) continue;

			if (executeAttack.attackVariant !== AttackVariant.MELEE) continue;

			const target = executeAttack.target;
			if (
				target &&
				world.has(target) &&
				target.targetableTag &&
				(target.hp ?? 0) > 0
			) {
				target.hp = Math.max(0, (target.hp ?? 0) - executeAttack.damage);
			}
		}
	};
}
