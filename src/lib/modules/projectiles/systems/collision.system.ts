import { world } from "$lib/core/world";
import { GameEngine, GameEvents } from "$lib/core/event-bus";
import { PROJECTILE_CONFIG, GAME_CONFIG } from "$lib/core/game-config";
import { VisualStatus } from "$lib/modules/render/components";

export const createCollisionSystem = () => {
	const projectiles = world.with("isProjectile", "position");

	return (_dt: number) => {
		for (const projectile of projectiles) {
			const target = projectile.target;
			const targetPos = projectile.targetPosition;

			if (targetPos && !target) {
				const dx = targetPos.x - projectile.position.x;
				const dy = targetPos.y - projectile.position.y;
				const dz = targetPos.z - projectile.position.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (
					distance < PROJECTILE_CONFIG.ballisticHitThreshold ||
					(projectile.position.y ?? 0) <= 0
				) {
					GameEngine.emit(GameEvents.PROJECTILE_MISS, {
						position: projectile.position,
					});
					world.remove(projectile);
					continue;
				}
			}

			if (target) {
				if (!world.has(target) || !target.position) {
					world.remove(projectile);
					continue;
				}

				if (target.isEnemy && (target.hp ?? 0) <= 0) {
					world.remove(projectile);
					continue;
				}

				const dx = target.position.x - projectile.position.x;
				const dy = target.position.y - projectile.position.y;
				const dz = target.position.z - projectile.position.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (distance < PROJECTILE_CONFIG.homingHitThreshold) {
					if (target.isEnemy) {
						target.hp = Math.max(
							0,
							(target.hp ?? 0) - (projectile.damage ?? 0),
						);

						if ((target.hp ?? 0) <= 0) {
							world.addComponent(target, "isDying", true);
							target.visualStatus = VisualStatus.DYING;
							target.deathTimer = GAME_CONFIG.deathAnimationDuration;
						}
					}

					world.remove(projectile);
				}
			}
		}
	};
};
