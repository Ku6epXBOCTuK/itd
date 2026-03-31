import { world, EnemyState, TowerState, type EnemyStateType } from "$lib/core/world";
import { uiState, GameState } from "$lib/adapters/ui-state/game-state.svelte";
import { GameEngine, GameEvents } from "$lib/core/event-bus";

let gameTriggered = false;

export const resetAttackSystem = () => {
	gameTriggered = false;
};

export const AttackSystem = (deltaTime: number) => {
	const currentTime = Date.now();
	const enemies = world.with("enemy", "x", "y", "z", "attackRange", "damage", "attackCooldown", "attackDuration", "attackStartTime", "enemyState", "target", "hp");
	const towers = world.with("tower", "hp", "maxHp", "towerState");

	for (const enemy of enemies) {
		if (enemy.enemyState === EnemyState.HAPPY) {
			continue;
		}

		const tx = enemy.target?.x ?? 0;
		const ty = enemy.target?.y ?? 0;
		const tz = enemy.target?.z ?? 0;
		const ex = enemy.x ?? 0;
		const ey = enemy.y ?? 0;
		const ez = enemy.z ?? 0;

		const dx = tx - ex;
		const dy = ty - ey;
		const dz = tz - ez;
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

		const attackRange = enemy.attackRange ?? 0;
		if (distance <= attackRange) {
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
				enemy.attackStartTime = currentTime;
			}

			if (enemy.enemyState === EnemyState.ATTACKING) {
				const attackElapsed = currentTime - enemy.attackStartTime;

				if (attackElapsed >= (enemy.attackDuration ?? 0)) {
					for (const tower of towers) {
						const towerHp = tower.hp ?? 0;
						const towerMaxHp = tower.maxHp ?? 500;

						const newHp = Math.max(0, towerHp - (enemy.damage ?? 0));
						tower.hp = newHp;

						uiState.towerHp = Math.floor(newHp);
						uiState.towerMaxHp = Math.floor(towerMaxHp);

						if (newHp <= 0 && !gameTriggered) {
							gameTriggered = true;
							tower.towerState = TowerState.BROKEN;

							const allEnemies = world.with("enemy", "enemyState");
							for (const e of allEnemies) {
								e.enemyState = EnemyState.HAPPY;
								e.attackStartTime = 0;
							}

							GameEngine.emit(GameEvents.STOP_GAME);
							return;
						}
					}

					enemy.enemyState = EnemyState.COOLDOWN;
					enemy.attackStartTime = currentTime;
				}
			}

			if (enemy.enemyState === EnemyState.COOLDOWN) {
				const cooldownElapsed = currentTime - enemy.attackStartTime;

				if (cooldownElapsed >= (enemy.attackCooldown ?? 0)) {
					enemy.enemyState = EnemyState.ATTACKING;
					enemy.attackStartTime = currentTime;
				}
			}
		} else {
			enemy.enemyState = EnemyState.MOVING;
		}
	}
};
