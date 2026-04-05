import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { SECOND_MS } from "$lib/core/constants";
import { PROJECTILE_CONFIG } from "$lib/core/game-config";
import { ProjectileVariant } from "$lib/modules/projectiles/components";

export function createBallisticMovementSystem(world: World<Entity>) {
	const projectiles = world.with("projectileTag", "position", "speed");

	return (dt: number) => {
		for (const projectile of projectiles) {
			if (
				projectile.projectileVariant !== ProjectileVariant.BALLISTIC ||
				!projectile.targetPosition
			)
				continue;

			const targetPos = projectile.targetPosition;

			const dx = targetPos.x - projectile.position.x;
			const dy = targetPos.y - projectile.position.y;
			const dz = targetPos.z - projectile.position.z;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (
				distance < PROJECTILE_CONFIG.ballisticHitThreshold ||
				projectile.position.y <= 0
			)
				continue;

			const direction = {
				x: dx / distance,
				y: dy / distance,
				z: dz / distance,
			};

			const moveDistance = projectile.speed * (dt / SECOND_MS);
			projectile.position.x += direction.x * moveDistance;
			projectile.position.y += direction.y * moveDistance;
			projectile.position.z += direction.z * moveDistance;
		}
	};
}
