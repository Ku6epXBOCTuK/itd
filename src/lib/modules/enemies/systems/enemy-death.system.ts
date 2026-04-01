import { world, EnemyState } from "$lib/core/world";
import { GAME_CONFIG } from "$lib/core/game-config";

export const EnemyDeathSystem = () => {
	const enemies = world.with("enemy", "position", "view");
	const currentTime = Date.now();

	for (const enemy of enemies) {
		if (enemy.enemy.enemyState !== EnemyState.DYING) {
			continue;
		}

		const deathElapsed = currentTime - enemy.enemy.deathStartTime;

		if (deathElapsed >= GAME_CONFIG.deathAnimationDuration) {
			world.remove(enemy);
		}
	}
};
