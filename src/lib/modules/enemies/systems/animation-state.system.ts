import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { AttackPhase, EnemyState } from "$lib/core/world";
import { VisualStatus } from "$lib/modules/render/components";

export function createAnimationStateSystem(world: World<Entity>) {
	const enemies = world.with(
		"enemyTag",
		"dyingTag",
		"attackPhase",
		"enemyState",
	);

	return () => {
		for (const enemy of enemies) {
			if (enemy.dyingTag) {
				enemy.visualStatus = VisualStatus.DYING;
			} else if (enemy.enemyState === EnemyState.HAPPY) {
				enemy.visualStatus = VisualStatus.HAPPY;
			} else if (
				enemy.attackPhase === AttackPhase.WINDUP ||
				enemy.attackPhase === AttackPhase.RECOVER
			) {
				enemy.visualStatus = VisualStatus.ATTACKING;
			} else if (enemy.attackPhase === AttackPhase.COOLDOWN) {
				enemy.visualStatus = VisualStatus.COOLDOWN;
			} else {
				enemy.visualStatus = VisualStatus.MOVING;
			}
		}
	};
}
