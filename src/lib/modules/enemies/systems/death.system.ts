import type { BaseContext } from "$lib/modules/shared/context";

export function createEnemyDeathSystem(ctx: BaseContext) {
	const world = ctx.world;
	const dyingEnemies = world.with("dyingTag", "position", "deathTimer");

	return (dt: number) => {
		for (const enemy of dyingEnemies) {
			enemy.deathTimer = enemy.deathTimer - dt;

			if (enemy.deathTimer <= 0) {
				world.remove(enemy);
			}
		}
	};
}
