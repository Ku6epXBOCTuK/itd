import { world, TowerState } from "$lib/core/world";
import { createProjectile } from "$lib/modules/projectiles/factories";
import { PROJECTILE_CONFIG } from "$lib/core/game-config";

export const createTowerAttackSystem = () => {
	const towers = world.with("tower", "position");
	const enemies = world.with("enemy", "position");

	return (dt: number) => {
		for (const tower of towers) {
			const finalStats = tower.tower.finalStats;

			if (tower.tower.towerState === TowerState.COOLDOWN) {
				tower.tower.cooldownTimer -= dt;
				if (tower.tower.cooldownTimer <= 0) {
					tower.tower.towerState = TowerState.IDLE;
					tower.tower.cooldownTimer = 0;
					tower.tower.target = undefined;
				}
				continue;
			}

			if (tower.tower.towerState === TowerState.FIRING) {
				tower.tower.animationTimer -= dt;
				if (tower.tower.animationTimer <= 0) {
					const target = tower.tower.target;
					if (
						target &&
						world.has(target) &&
						target.enemy &&
						target.enemy.hp > 0
					) {
						createProjectile(
							tower.position,
							finalStats.damage,
							{ homing: true, speed: PROJECTILE_CONFIG.speedHoming },
							target,
						);
					}
					tower.tower.towerState = TowerState.COOLDOWN;
					tower.tower.cooldownTimer = finalStats.attackCooldown;
				}
				continue;
			}

			let targetEnemy: ReturnType<typeof world.with>[number] | null = null;
			let minDistance = finalStats.attackRange;

			for (const enemy of enemies) {
				if (enemy.enemy.hp <= 0) continue;

				const dx = enemy.position.x - tower.position.x;
				const dy = enemy.position.y - tower.position.y;
				const dz = enemy.position.z - tower.position.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (distance <= finalStats.attackRange && distance < minDistance) {
					minDistance = distance;
					targetEnemy = enemy;
				}
			}

			if (targetEnemy) {
				tower.tower.towerState = TowerState.FIRING;
				tower.tower.target = targetEnemy;
				tower.tower.animationTimer = tower.tower.attackAnimationDuration;
			}
		}
	};
};
