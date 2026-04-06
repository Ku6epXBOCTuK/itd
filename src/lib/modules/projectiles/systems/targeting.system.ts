import type { BaseContext } from "$lib/modules/shared/context";
import type { Entity, TargetableEntity } from "$lib/core/world";
import { GAME_CONFIG } from "$lib/core/game-config";
import { ProjectileVariant } from "$lib/modules/projectiles/components";

export function createTargetingSystem(ctx: BaseContext) {
	const world = ctx.world;
	const homingProjectiles = world.with("projectileTag", "position");

	return (_dt: number) => {
		for (const projectile of homingProjectiles) {
			if (projectile.projectileVariant !== ProjectileVariant.HOMING) continue;

			const needsNewTarget =
				!projectile.target ||
				!world.has(projectile.target) ||
				projectile.target.hp <= 0;

			if (needsNewTarget) {
				const enemies = world.with("targetableTag", "position", "hp");
				let nearest: Entity | undefined = undefined;
				let minDistance: number = GAME_CONFIG.targetingMinDistance;

				for (const enemy of enemies) {
					if (enemy.hp <= 0) continue;

					const dx = enemy.position.x - projectile.position.x;
					const dy = enemy.position.y - projectile.position.y;
					const dz = enemy.position.z - projectile.position.z;
					const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

					if (distance < minDistance) {
						minDistance = distance;
						nearest = enemy;
					}
				}

				projectile.target = nearest as TargetableEntity;
			}
		}
	};
}
