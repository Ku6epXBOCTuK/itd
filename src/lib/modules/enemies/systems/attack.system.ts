import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { EnemyState, AttackPhase } from "$lib/core/world";
import { ATTACK_WINDUP_RATIO } from "$lib/core/constants";

export function createEnemyAttackSystem(world: World<Entity>) {
	const enemies = world
		.with(
			"enemyTag",
			"position",
			"targetPosition",
			"attackRange",
			"damage",
			"attackPhase",
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

			enemy.attackTimer = (enemy.attackTimer ?? 0) - dt;

			if (enemy.attackTimer <= 0) {
				if (enemy.attackPhase === AttackPhase.WINDUP) {
					const tower = towers.first;
					if (tower) {
						tower.hp = Math.max(0, tower.hp - enemy.damage);
					}

					enemy.attackPhase = AttackPhase.RECOVER;
					enemy.attackTimer = (enemy.attackDuration ?? 0) * ATTACK_WINDUP_RATIO;
				} else if (enemy.attackPhase === AttackPhase.RECOVER) {
					enemy.attackPhase = AttackPhase.COOLDOWN;
					enemy.attackTimer = enemy.attackCooldown;
				} else if (enemy.attackPhase === AttackPhase.COOLDOWN) {
					enemy.attackPhase = AttackPhase.WINDUP;
					enemy.attackTimer = (enemy.attackDuration ?? 0) * ATTACK_WINDUP_RATIO;
				}
			}
		}
	};
}
