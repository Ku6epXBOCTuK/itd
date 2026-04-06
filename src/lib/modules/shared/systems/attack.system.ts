import type { BaseContext } from "$lib/modules/shared/context";
import { AttackPhase } from "$lib/modules/shared/components";

export function createAttackSystem(ctx: BaseContext) {
	const attackers = ctx.world.with(
		"activeAttack",
		"attackStats",
		"target",
		"damage",
	);

	return (dt: number) => {
		for (const entity of attackers) {
			const activeAttack = entity.activeAttack;
			const attackStats = entity.attackStats;

			activeAttack.timer -= dt;

			if (activeAttack.timer <= 0) {
				if (activeAttack.attackPhase === AttackPhase.WINDUP) {
					activeAttack.attackPhase = AttackPhase.ACTIVE;
					activeAttack.timer = 0;
				} else if (activeAttack.attackPhase === AttackPhase.ACTIVE) {
					activeAttack.attackPhase = AttackPhase.RECOVER;
					activeAttack.timer = attackStats.recoveryDuration;
					ctx.world.addComponent(entity, "executeAttack", {
						attackVariant: attackStats.type,
						damage: entity.damage,
						target: entity.target,
					});
				} else if (activeAttack.attackPhase === AttackPhase.RECOVER) {
					ctx.world.addComponent(
						entity,
						"attackCooldownTimer",
						attackStats.cooldownDuration,
					);
					ctx.world.removeComponent(entity, "activeAttack");
				}
			}
		}
	};
}
