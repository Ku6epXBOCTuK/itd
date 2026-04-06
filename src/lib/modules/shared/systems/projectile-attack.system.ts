import type { BaseContext } from "$lib/modules/shared/context";
import { AttackVariant } from "$lib/modules/shared/components";
import { createProjectile } from "$lib/modules/projectiles/factory";
import { PROJECTILE_CONFIG } from "$lib/core/game-config";

export function createProjectileAttackSystem(ctx: BaseContext) {
	const world = ctx.world;
	const shooters = world.with("executeAttack", "position");

	return () => {
		for (const entity of shooters) {
			const executeAttack = entity.executeAttack;
			if (!executeAttack) continue;

			const attackVariant = executeAttack.attackVariant;
			const target = executeAttack.target;

			if (
				attackVariant !== AttackVariant.PROJECTILE_HOMING &&
				attackVariant !== AttackVariant.PROJECTILE_BALLISTIC
			) {
				continue;
			}

			if (
				target &&
				ctx.world.has(target) &&
				target.targetableTag &&
				(target.hp ?? 0) > 0
			) {
				const projectileType =
					attackVariant === AttackVariant.PROJECTILE_HOMING
						? "homing"
						: "ballistic";
				const speed =
					attackVariant === AttackVariant.PROJECTILE_HOMING
						? PROJECTILE_CONFIG.speedHoming
						: PROJECTILE_CONFIG.speed;

				createProjectile(
					world,
					entity.position!,
					executeAttack.damage,
					{ type: projectileType, speed },
					target,
				);
			}
		}
	};
}
