import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { EnemyState, TowerState } from "$lib/core/world";
import { GameEngine, GameEvents } from "$lib/core/event-bus";
import { VisualStatus } from "$lib/modules/render/components";

let gameTriggered = false;

export function resetAttackSystem() {
	gameTriggered = false;
}

export function createAttackSystem(world: World<Entity>) {
	const enemies = world.with("enemyTag", "position").without("dyingTag");
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

			if (distance <= (enemy.attackRange ?? 0)) {
				let hasActiveTower = false;
				for (const tower of towers) {
					if (tower.towerState !== TowerState.BROKEN) {
						hasActiveTower = true;
						break;
					}
				}

				if (!hasActiveTower) {
					continue;
				}

				if (enemy.enemyState === EnemyState.MOVING) {
					enemy.enemyState = EnemyState.ATTACKING;
					enemy.visualStatus = VisualStatus.ATTACKING;
					enemy.attackTimer = enemy.attackDuration;
				}

				if (enemy.enemyState === EnemyState.ATTACKING) {
					enemy.attackTimer = (enemy.attackTimer ?? 0) - dt;

					if ((enemy.attackTimer ?? 0) <= 0) {
						for (const tower of towers) {
							const towerHp = tower.hp ?? 0;
							const newHp = Math.max(0, towerHp - (enemy.damage ?? 0));
							tower.hp = newHp;

							if (newHp <= 0 && !gameTriggered) {
								gameTriggered = true;
								tower.towerState = TowerState.BROKEN;

								const allEnemies = world.with("enemyTag");
								for (const e of allEnemies) {
									e.enemyState = EnemyState.HAPPY;
									e.visualStatus = VisualStatus.HAPPY;
									e.cooldownTimer = 0;
								}

								GameEngine.emit(GameEvents.STOP_GAME);
								return;
							}
						}

						enemy.enemyState = EnemyState.COOLDOWN;
						enemy.visualStatus = VisualStatus.COOLDOWN;
						enemy.cooldownTimer = enemy.attackCooldown;
					}
				}

				if (enemy.enemyState === EnemyState.COOLDOWN) {
					enemy.cooldownTimer = (enemy.cooldownTimer ?? 0) - dt;

					if ((enemy.cooldownTimer ?? 0) <= 0) {
						enemy.enemyState = EnemyState.ATTACKING;
						enemy.visualStatus = VisualStatus.ATTACKING;
						enemy.attackTimer = enemy.attackDuration;
					}
				}
			} else {
				enemy.enemyState = EnemyState.MOVING;
				enemy.visualStatus = VisualStatus.MOVING;
			}
		}
	};
}
