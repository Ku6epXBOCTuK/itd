import { world } from "$lib/core/world";

const HIT_THRESHOLD = 0.3;

export const BallisticMovementSystem = (deltaTime: number) => {
	const projectiles = world.with("projectile", "ballistic", "position");

	for (const projectile of projectiles) {
		if (!projectile.ballistic || !projectile.projectile.targetPosition) continue;

		const targetPos = projectile.projectile.targetPosition;

		const dx = targetPos.x - projectile.position.x;
		const dy = targetPos.y - projectile.position.y;
		const dz = targetPos.z - projectile.position.z;
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

		if (distance < HIT_THRESHOLD || projectile.position.y <= 0) continue;

		const direction = {
			x: dx / distance,
			y: dy / distance,
			z: dz / distance,
		};

		const moveDistance = projectile.ballistic.speed * (deltaTime / 1000);
		projectile.position.x += direction.x * moveDistance;
		projectile.position.y += direction.y * moveDistance;
		projectile.position.z += direction.z * moveDistance;
	}
};
