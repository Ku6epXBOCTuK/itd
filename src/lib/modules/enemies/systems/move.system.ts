import { world, EnemyState } from "$lib/core/world";
import { SECOND_MS } from "$lib/core/constants";

export const MoveSystem = (deltaTime: number) => {
	const enemies = world.with("enemy", "position");

	for (const enemy of enemies) {
		if (enemy.enemy.enemyState !== EnemyState.MOVING) continue;

		const tx = enemy.enemy.target.x;
		const ty = enemy.enemy.target.y;
		const tz = enemy.enemy.target.z;
		const ex = enemy.position.x;
		const ey = enemy.position.y;
		const ez = enemy.position.z;

		const dx = tx - ex;
		const dy = ty - ey;
		const dz = tz - ez;
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

		if (distance > enemy.enemy.attackRange) {
			const direction = {
				x: dx / distance,
				y: dy / distance,
				z: dz / distance,
			};

			const moveDistance = enemy.enemy.speed * (deltaTime / SECOND_MS);
			enemy.position.x += direction.x * moveDistance;
			enemy.position.y += direction.y * moveDistance;
			enemy.position.z += direction.z * moveDistance;
		}
	}
};
