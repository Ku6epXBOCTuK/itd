import type { BaseContext } from "$lib/modules/shared/context";
import { GameEngine, GameEvents } from "$lib/core/event-bus";
import { PROJECTILE_CONFIG } from "$lib/core/game-config";

export function createCollisionSystem(ctx: BaseContext) {
	const world = ctx.world;
	const projectiles = world.with("projectileTag", "position", "damage");

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
					projectile.position.y <= 0
				) {
					GameEngine.emit(GameEvents.PROJECTILE_MISS, {
						position: projectile.position,
					});
					world.remove(projectile);
					continue;
				}
			}

			if (target) {
				if (!world.has(target)) {
					world.remove(projectile);
					continue;
				}

				if (target.hp <= 0) {
					world.remove(projectile);
					continue;
				}

				const dx = target.position.x - projectile.position.x;
				const dy = target.position.y - projectile.position.y;
				const dz = target.position.z - projectile.position.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (distance < PROJECTILE_CONFIG.homingHitThreshold) {
					target.hp = Math.max(0, target.hp - projectile.damage);
					world.remove(projectile);
				}
			}
		}
	};
}
