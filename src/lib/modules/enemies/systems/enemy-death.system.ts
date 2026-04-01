import { world, EnemyState } from "$lib/core/world";
import * as THREE from "three";

const DEATH_ANIMATION_DURATION = 500;

export const EnemyDeathSystem = () => {
	const enemies = world.with("enemy", "position", "view");
	const currentTime = Date.now();

	for (const enemy of enemies) {
		if (enemy.enemy.enemyState !== EnemyState.DYING) {
			continue;
		}

		const deathElapsed = currentTime - enemy.enemy.deathStartTime;

		if (deathElapsed >= DEATH_ANIMATION_DURATION) {
			if (enemy.view) {
				enemy.view.mesh.removeFromParent();
				enemy.view.mesh.geometry.dispose();
				(enemy.view.mesh.material as THREE.Material).dispose();
			}
			world.remove(enemy);
		}
	}
};
