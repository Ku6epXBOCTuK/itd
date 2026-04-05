import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { EnemyState } from "$lib/core/world";

export function createEnemyAttackSystem(world: World<Entity>) {
	const enemies = world
		.with("enemyTag", "position", "targetPosition", "attackRange")
		.without("dyingTag");
	const towers = world.with("towerTag");

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

			if (distance > (enemy.attackRange ?? 0)) {
				continue;
			}

			if (enemy.enemyState === EnemyState.ATTACKING) {
				enemy.attackTimer = (enemy.attackTimer ?? 0) - dt;

				if ((enemy.attackTimer ?? 0) <= 0) {
					const tower = towers.first;
					if (tower) {
						tower.hp = Math.max(0, (tower.hp ?? 0) - (enemy.damage ?? 0));
					}

					enemy.enemyState = EnemyState.COOLDOWN;
					enemy.cooldownTimer = enemy.attackCooldown;
				}
			}

			if (enemy.enemyState === EnemyState.COOLDOWN) {
				enemy.cooldownTimer = (enemy.cooldownTimer ?? 0) - dt;

				if ((enemy.cooldownTimer ?? 0) <= 0) {
					enemy.enemyState = EnemyState.ATTACKING;
					enemy.attackTimer = enemy.attackDuration;
				}
			}
		}
	};
}
