import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { EnemyState, AttackPhase } from "$lib/core/world";

export function createEnemyAttackSystem(world: World<Entity>) {
	const enemies = world
		.with(
			"enemyTag",
			"position",
			"targetPosition",
			"attackRange",
			"damage",
			"attackState",
		)
		.without("dyingTag");
	const towers = world.with("towerTag", "hp");

	return (dt: number) => {
		for (const enemy of enemies) {
			if (enemy.enemyState === EnemyState.HAPPY) {
				continue;
			}

			const tx = enemy.targetPosition?.x ?? 0;
			const ty = enemy.targetPosition?.y ?? 1;
			const tz = enemy.targetPosition?.z ?? 0;
			const ex = enemy.position.x;
			const ey = enemy.position.y;
			const ez = enemy.position.z;

			const dx = tx - ex;
			const dy = ty - ey;
			const dz = tz - ez;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance > enemy.attackRange) {
				continue;
			}

			const attackState = enemy.attackState!;
			attackState.timer -= dt;

			if (attackState.timer <= 0) {
				if (attackState.attackPhase === AttackPhase.WINDUP) {
					const tower = towers.first;
					if (tower) {
						tower.hp = Math.max(0, tower.hp - enemy.damage);
					}

					attackState.attackPhase = AttackPhase.RECOVER;
					attackState.timer = attackState.recoveryDuration;
				} else if (attackState.attackPhase === AttackPhase.RECOVER) {
					attackState.attackPhase = AttackPhase.COOLDOWN;
					attackState.timer = attackState.cooldownDuration;
				} else if (attackState.attackPhase === AttackPhase.COOLDOWN) {
					attackState.attackPhase = AttackPhase.WINDUP;
					attackState.timer = attackState.windupDuration;
				}
			}
		}
	};
}
