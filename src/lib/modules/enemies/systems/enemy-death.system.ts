import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { VisualStatus } from "$lib/modules/render/components";

export function createEnemyDeathSystem(world: World<Entity>) {
	const dyingEnemies = world.with("dyingTag", "position", "deathTimer");

	return (dt: number) => {
		for (const enemy of dyingEnemies) {
			enemy.visualStatus = VisualStatus.DYING;
			enemy.deathTimer = enemy.deathTimer - dt;

			if (enemy.deathTimer <= 0) {
				world.remove(enemy);
			}
		}
	};
}
