import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { AttackVariant } from "$lib/modules/shared/components";
import { createProjectile } from "$lib/modules/projectiles/factory";
import { PROJECTILE_CONFIG } from "$lib/core/game-config";

export function createProjectileAttackSystem(world: World<Entity>) {
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
				world.has(target) &&
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
					entity.position!,
					executeAttack.damage,
					{ type: projectileType, speed },
					target,
				);
			}
		}
	};
}
