import { world } from "$lib/core/world";

export const ProjectileMoveSystem = (deltaTime: number) => {
	const projectiles = world.with("projectile", "position");

	for (const projectile of projectiles) {
		const target = world.entity(projectile.projectile.targetId);

		if (!target || !target.position) {
			continue;
		}

		const dx = target.position.x - projectile.position.x;
		const dy = target.position.y - projectile.position.y;
		const dz = target.position.z - projectile.position.z;
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

		if (distance < 0.3) {
			continue;
		}

		const direction = {
			x: dx / distance,
			y: dy / distance,
			z: dz / distance,
		};

		const speed = 8;
		const moveDistance = speed * (deltaTime / 1000);
		projectile.position.x += direction.x * moveDistance;
		projectile.position.y += direction.y * moveDistance;
		projectile.position.z += direction.z * moveDistance;
	}
};
