import { world, EnemyState } from "$lib/core/world";
import { GAME_CONFIG } from "$lib/core/game-config";

export const createEnemyDeathSystem = () => {
	const enemies = world.with("enemy", "position", "view");

	return (dt: number) => {
		for (const enemy of enemies) {
			if (enemy.enemy.enemyState !== EnemyState.DYING) {
				continue;
			}

			enemy.enemy.deathTimer -= dt;

			if (enemy.enemy.deathTimer <= 0) {
				world.remove(enemy);
			}
		}
	};
};
