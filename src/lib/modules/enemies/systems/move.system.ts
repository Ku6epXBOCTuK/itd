import { world, EnemyState } from "$lib/core/world";

export const MoveSystem = (deltaTime: number) => {
	const enemies = world.with("enemy", "x", "y", "z", "speed", "target", "attackRange", "enemyState");

	for (const enemy of enemies) {
		if (enemy.enemyState !== EnemyState.MOVING) continue;

		const tx = enemy.target?.x ?? 0;
		const ty = enemy.target?.y ?? 0;
		const tz = enemy.target?.z ?? 0;
		const ex = enemy.x ?? 0;
		const ey = enemy.y ?? 0;
		const ez = enemy.z ?? 0;

		const dx = tx - ex;
		const dy = ty - ey;
		const dz = tz - ez;
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

		const attackRange = enemy.attackRange ?? 0;
		if (distance > attackRange) {
			const direction = {
				x: dx / distance,
				y: dy / distance,
				z: dz / distance,
			};

			const moveDistance = (enemy.speed ?? 0) * (deltaTime / 1000);
			enemy.x! += direction.x * moveDistance;
			enemy.y! += direction.y * moveDistance;
			enemy.z! += direction.z * moveDistance;
		}
	}
};
