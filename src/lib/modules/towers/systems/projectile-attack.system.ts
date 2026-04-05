import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { AttackVariant } from "$lib/modules/shared/components";
import { createProjectile } from "$lib/modules/projectiles/factory";
import { PROJECTILE_CONFIG } from "$lib/core/game-config";

export function createProjectileAttackSystem(world: World<Entity>) {
	const shooters = world.with("executeAttack", "position", "target");

	return () => {
		for (const entity of shooters) {
			if (entity.executeAttack?.attackVariant !== AttackVariant.PROJECTILE) {
				continue;
			}

			const target = entity.target;
			if (
				target &&
				world.has(target) &&
				target.targetableTag &&
				(target.hp ?? 0) > 0
			) {
				createProjectile(
					entity.position!,
					entity.executeAttack.damage,
					{ type: "homing", speed: PROJECTILE_CONFIG.speedHoming },
					target,
				);
			}
		}
	};
}
