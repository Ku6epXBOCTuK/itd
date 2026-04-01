import { world, EnemyState } from "$lib/core/world";
import * as THREE from "three";
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
			if (enemy.view) {
				enemy.view.mesh.removeFromParent();
				enemy.view.mesh.geometry.dispose();
				(enemy.view.mesh.material as THREE.Material).dispose();
			}
			if (enemy.enemy.sprite) {
				enemy.enemy.sprite.removeFromParent();
				(enemy.enemy.sprite.material as THREE.Material).dispose();
			}
			world.remove(enemy);
		}
	}
};
