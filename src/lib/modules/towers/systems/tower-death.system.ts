import type { BaseContext } from "$lib/modules/shared/context";
import { EnemyState, TowerState } from "$lib/core/world";
import { GAME_OVER_ANIMATION_DURATION } from "$lib/core/constants";

export function createTowerDeathSystem(ctx: BaseContext) {
	const world = ctx.world;
	const towers = world.with("towerTag", "hp", "towerState");
	const existingTimer = world.with("gameOverTimer");

	return () => {
		if (existingTimer.first) return;

		const tower = towers.first;
		if (!tower) return;

		if (tower.hp <= 0 && tower.towerState !== TowerState.BROKEN) {
			tower.towerState = TowerState.BROKEN;

			world.add({
				gameOverTimer: {
					remainingTime: GAME_OVER_ANIMATION_DURATION,
				},
			});

			const allEnemies = world.with("enemyTag");
			for (const e of allEnemies) {
				e.enemyState = EnemyState.HAPPY;
			}
		}
	};
}
