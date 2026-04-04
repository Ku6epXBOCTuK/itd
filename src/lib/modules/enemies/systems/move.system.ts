import { world, EnemyState } from "$lib/core/world";
import { SECOND_MS } from "$lib/core/constants";

export const createMoveSystem = () => {
	const enemies = world.with("enemyTag", "position").without("dyingTag");

	return (dt: number) => {
		for (const enemy of enemies) {
			if (enemy.enemyState !== EnemyState.MOVING) continue;

			const tx = enemy.targetPosition?.x ?? 0;
			const ty = enemy.targetPosition?.y ?? 1;
			const tz = enemy.targetPosition?.z ?? 0;
			const ex = enemy.position.x;
			const ey = enemy.position.y;
			const ez = enemy.position.z;

			const dx = tx - ex;
			const dy = ty - ey;
			const dz = tz - ez;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance > (enemy.attackRange ?? 0)) {
				const direction = {
					x: dx / distance,
					y: dy / distance,
					z: dz / distance,
				};

				const moveDistance = (enemy.speed ?? 0) * (dt / SECOND_MS);
				enemy.position.x += direction.x * moveDistance;
				enemy.position.y += direction.y * moveDistance;
				enemy.position.z += direction.z * moveDistance;
			}
		}
	};
};
