import type { BaseContext } from "$lib/modules/shared/context";
import { EnemyState } from "$lib/core/world";
import { VisualStatus } from "$lib/modules/render/components";

export function createAnimationStateSystem(ctx: BaseContext) {
	const world = ctx.world;
	const enemies = world.with("enemyTag", "enemyState");
	const towers = world.with("towerTag");

	return () => {
		for (const enemy of enemies) {
			if (enemy.dyingTag) {
				enemy.visualStatus = VisualStatus.DYING;
			} else if (enemy.enemyState === EnemyState.HAPPY) {
				enemy.visualStatus = VisualStatus.HAPPY;
			} else if (enemy.activeAttack) {
				enemy.visualStatus = VisualStatus.ATTACKING;
			} else if (enemy.attackCooldownTimer) {
				enemy.visualStatus = VisualStatus.COOLDOWN;
			} else {
				enemy.visualStatus = VisualStatus.MOVING;
			}
		}

		const tower = towers.first;
		if (tower) {
			if (tower.activeAttack) {
				tower.visualStatus = VisualStatus.ATTACKING;
			} else if (tower.attackCooldownTimer) {
				tower.visualStatus = VisualStatus.COOLDOWN;
			} else {
				tower.visualStatus = VisualStatus.IDLE;
			}
		}
	};
}
