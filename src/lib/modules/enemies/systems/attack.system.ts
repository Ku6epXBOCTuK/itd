import { world, EnemyState, TowerState } from "$lib/core/world";
import { GameEngine, GameEvents } from "$lib/core/event-bus";

let gameTriggered = false;

export function resetAttackSystem() {
	gameTriggered = false;
}

export const createAttackSystem = () => {
	const enemies = world.with("enemy", "position");
	const towers = world.with("tower");

	return (dt: number) => {
		for (const enemy of enemies) {
			if (
				enemy.enemy.enemyState === EnemyState.HAPPY ||
				enemy.enemy.enemyState === EnemyState.DYING
			) {
				continue;
			}

			const tx = enemy.enemy.target.x;
			const ty = enemy.enemy.target.y;
			const tz = enemy.enemy.target.z;
			const ex = enemy.position.x;
			const ey = enemy.position.y;
			const ez = enemy.position.z;

			const dx = tx - ex;
			const dy = ty - ey;
			const dz = tz - ez;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance <= enemy.enemy.attackRange) {
				let hasActiveTower = false;
				for (const tower of towers) {
					if (tower.tower.towerState !== TowerState.BROKEN) {
						hasActiveTower = true;
						break;
					}
				}

				if (!hasActiveTower) {
					continue;
				}

				if (enemy.enemy.enemyState === EnemyState.MOVING) {
					enemy.enemy.enemyState = EnemyState.ATTACKING;
					enemy.enemy.attackTimer = enemy.enemy.attackDuration;
				}

				if (enemy.enemy.enemyState === EnemyState.ATTACKING) {
					enemy.enemy.attackTimer -= dt;

					if (enemy.enemy.attackTimer <= 0) {
						for (const tower of towers) {
							const towerHp = tower.tower.finalStats.hp;

							const newHp = Math.max(0, towerHp - enemy.enemy.damage);
							tower.tower.finalStats.hp = newHp;

							if (newHp <= 0 && !gameTriggered) {
								gameTriggered = true;
								tower.tower.towerState = TowerState.BROKEN;

								const allEnemies = world.with("enemy");
								for (const e of allEnemies) {
									e.enemy.enemyState = EnemyState.HAPPY;
									e.enemy.cooldownTimer = 0;
								}

								GameEngine.emit(GameEvents.STOP_GAME);
								return;
							}
						}

						enemy.enemy.enemyState = EnemyState.COOLDOWN;
						enemy.enemy.cooldownTimer = enemy.enemy.attackCooldown;
					}
				}

				if (enemy.enemy.enemyState === EnemyState.COOLDOWN) {
					enemy.enemy.cooldownTimer -= dt;

					if (enemy.enemy.cooldownTimer <= 0) {
						enemy.enemy.enemyState = EnemyState.ATTACKING;
						enemy.enemy.attackTimer = enemy.enemy.attackDuration;
					}
				}
			} else {
				enemy.enemy.enemyState = EnemyState.MOVING;
			}
		}
	};
};
