import { world } from "$lib/core/world";

export const ProjectileMoveSystem = (deltaTime: number) => {
	const projectiles = world.with("projectile", "x", "y", "z", "targetId");

	for (const projectile of projectiles) {
		const target = world.entity(projectile.targetId!);

		if (!target || target.x === undefined || target.y === undefined || target.z === undefined) {
			continue;
		}

		const dx = target.x - (projectile.x ?? 0);
		const dy = target.y - (projectile.y ?? 0);
		const dz = target.z - (projectile.z ?? 0);
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
		projectile.x! += direction.x * moveDistance;
		projectile.y! += direction.y * moveDistance;
		projectile.z! += direction.z * moveDistance;
	}
};
