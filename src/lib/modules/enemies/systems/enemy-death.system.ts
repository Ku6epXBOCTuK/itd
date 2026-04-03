import { world } from "$lib/core/world";

export const createEnemyDeathSystem = () => {
	const dyingEnemies = world.with("dying", "position", "view");

	return (dt: number) => {
		for (const enemy of dyingEnemies) {
			enemy.dying.deathTimer -= dt;

			if (enemy.dying.deathTimer <= 0) {
				world.remove(enemy);
			}
		}
	};
};
