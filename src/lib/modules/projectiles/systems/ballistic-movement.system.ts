import { world } from "$lib/core/world";
import { SECOND_MS } from "$lib/core/constants";
import { PROJECTILE_CONFIG } from "$lib/core/game-config";

export const createBallisticMovementSystem = () => {
	const projectiles = world.with("projectileTag", "position");

	return (dt: number) => {
		for (const projectile of projectiles) {
			if (
				projectile.projectileType !== "ballistic" ||
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
				(projectile.position.y ?? 0) <= 0
			)
				continue;

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
