import { world } from "$lib/core/world";

export const MoveSystem = (deltaTime: number) => {
	const enemies = world.with("position", "speed", "target", "attackRange");

	for (const enemy of enemies) {
		const dx = enemy.target.x - enemy.position.x;
		const dy = enemy.target.y - enemy.position.y;
		const dz = enemy.target.z - enemy.position.z;
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

		if (distance > enemy.attackRange) {
			const direction = {
				x: dx / distance,
				y: dy / distance,
				z: dz / distance,
			};

			const moveDistance = enemy.speed * (deltaTime / 1000);
			enemy.position.x += direction.x * moveDistance;
			enemy.position.y += direction.y * moveDistance;
			enemy.position.z += direction.z * moveDistance;
		}
	}
};
