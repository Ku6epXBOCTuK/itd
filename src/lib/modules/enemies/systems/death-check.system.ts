import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { GAME_CONFIG } from "$lib/core/game-config";

export function createDeathCheckSystem(world: World<Entity>) {
	const enemies = world.with("enemyTag", "hp").without("dyingTag");

	return () => {
		for (const enemy of enemies) {
			if (enemy.hp <= 0) {
				world.addComponent(enemy, "dyingTag", true);
				world.addComponent(
					enemy,
					"deathTimer",
					GAME_CONFIG.deathAnimationDuration,
				);
			}
		}
	};
}
