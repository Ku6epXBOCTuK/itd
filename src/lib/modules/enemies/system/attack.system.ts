import { world } from "$lib/core/world";
import { uiState } from "$lib/adapters/ui-state/game-state.svelte";
import { EnemyState } from "../enemies.components";

export const AttackSystem = (deltaTime: number) => {
	const currentTime = Date.now();
	const enemies = world.with("position", "attackRange", "damage", "attackCooldown", "attackDuration", "attackStartTime", "state", "target");
	const towers = world.with("tower", "hp", "maxHp");

	for (const enemy of enemies) {
		const dx = enemy.target.x - enemy.position.x;
		const dy = enemy.target.y - enemy.position.y;
		const dz = enemy.target.z - enemy.position.z;
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

		if (distance <= enemy.attackRange) {
			if (enemy.state === EnemyState.MOVING) {
				enemy.state = EnemyState.ATTACKING;
				enemy.attackStartTime = currentTime;
			}

			if (enemy.state === EnemyState.ATTACKING) {
				const attackElapsed = currentTime - enemy.attackStartTime;

				if (attackElapsed >= enemy.attackDuration) {
					for (const tower of towers) {
						tower.hp -= enemy.damage;

						if (tower.hp <= 0) {
							tower.hp = 0;
							uiState.gameOver = true;
						}

						uiState.towerHp = Math.floor(tower.hp);
					}

					enemy.state = EnemyState.COOLDOWN;
					enemy.attackStartTime = currentTime;
				}
			}

			if (enemy.state === EnemyState.COOLDOWN) {
				const cooldownElapsed = currentTime - enemy.attackStartTime;

				if (cooldownElapsed >= enemy.attackCooldown) {
					enemy.state = EnemyState.ATTACKING;
					enemy.attackStartTime = currentTime;
				}
			}
		} else {
			enemy.state = EnemyState.MOVING;
		}
	}
};
