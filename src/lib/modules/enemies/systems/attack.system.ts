import { world, EnemyState, TowerState } from "$lib/core/world";
import { GameEngine, GameEvents } from "$lib/core/event-bus";

let gameTriggered = false;

export const resetAttackSystem = () => {
	gameTriggered = false;
};

export const AttackSystem = (_deltaTime: number) => {
	const currentTime = Date.now();
	const enemies = world.with("enemy", "position");
	const towers = world.with("tower");

	for (const enemy of enemies) {
		if (enemy.enemy.enemyState === EnemyState.HAPPY) {
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
				enemy.enemy.attackStartTime = currentTime;
			}

			if (enemy.enemy.enemyState === EnemyState.ATTACKING) {
				const attackElapsed = currentTime - enemy.enemy.attackStartTime;

				if (attackElapsed >= enemy.enemy.attackDuration) {
					for (const tower of towers) {
						const towerHp = tower.tower.hp;

						const newHp = Math.max(0, towerHp - enemy.enemy.damage);
						tower.tower.hp = newHp;

						if (newHp <= 0 && !gameTriggered) {
							gameTriggered = true;
							tower.tower.towerState = TowerState.BROKEN;

							const allEnemies = world.with("enemy");
							for (const e of allEnemies) {
								e.enemy.enemyState = EnemyState.HAPPY;
								e.enemy.attackStartTime = 0;
							}

							GameEngine.emit(GameEvents.STOP_GAME);
							return;
						}
					}

					enemy.enemy.enemyState = EnemyState.COOLDOWN;
					enemy.enemy.attackStartTime = currentTime;
				}
			}

			if (enemy.enemy.enemyState === EnemyState.COOLDOWN) {
				const cooldownElapsed = currentTime - enemy.enemy.attackStartTime;

				if (cooldownElapsed >= enemy.enemy.attackCooldown) {
					enemy.enemy.enemyState = EnemyState.ATTACKING;
					enemy.enemy.attackStartTime = currentTime;
				}
			}
		} else {
			enemy.enemy.enemyState = EnemyState.MOVING;
		}
	}
};
