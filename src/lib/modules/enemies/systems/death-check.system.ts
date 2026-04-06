import type { BaseContext } from "$lib/modules/shared/context";
import { GAME_CONFIG } from "$lib/core/game-config";

export function createDeathCheckSystem(ctx: BaseContext) {
	const world = ctx.world;
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
