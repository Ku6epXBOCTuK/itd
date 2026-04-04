import { world } from "$lib/core/world";
import { VisualStatus } from "$lib/modules/render/components";

export const createEnemyDeathSystem = () => {
	const dyingEnemies = world.with("dyingTag", "position");

	return (dt: number) => {
		for (const enemy of dyingEnemies) {
			enemy.visualStatus = VisualStatus.DYING;
			enemy.deathTimer = (enemy.deathTimer ?? 0) - dt;

			if ((enemy.deathTimer ?? 0) <= 0) {
				world.remove(enemy);
			}
		}
	};
};
