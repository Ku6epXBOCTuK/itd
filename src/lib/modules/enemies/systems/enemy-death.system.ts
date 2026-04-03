import { world } from "$lib/core/world";

export const createEnemyDeathSystem = () => {
	const dyingEnemies = world.with("isDying", "position");

	return (dt: number) => {
		for (const enemy of dyingEnemies) {
			enemy.deathTimer = (enemy.deathTimer ?? 0) - dt;

			if ((enemy.deathTimer ?? 0) <= 0) {
				world.remove(enemy);
			}
		}
	};
};
