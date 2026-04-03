import { world } from "$lib/core/world";
import { SECOND_MS } from "$lib/core/constants";
import { PROJECTILE_CONFIG } from "$lib/core/game-config";

export const createHomingMovementSystem = () => {
	const projectiles = world.with("isProjectile", "position");

	return (dt: number) => {
		for (const projectile of projectiles) {
			if (projectile.projectileType !== "homing" || !projectile.target)
				continue;

			const target = projectile.target;
			if (!target.position) continue;

			const dx = target.position.x - projectile.position.x;
			const dy = target.position.y - projectile.position.y;
			const dz = target.position.z - projectile.position.z;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance < PROJECTILE_CONFIG.homingHitThreshold) continue;

			const direction = {
				x: dx / distance,
				y: dy / distance,
				z: dz / distance,
			};

			const moveDistance = (projectile.speed ?? 0) * (dt / SECOND_MS);
			projectile.position.x += direction.x * moveDistance;
			projectile.position.y += direction.y * moveDistance;
			projectile.position.z += direction.z * moveDistance;
		}
	};
};
