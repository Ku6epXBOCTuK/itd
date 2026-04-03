import { world, TowerState } from "$lib/core/world";
import { createProjectile } from "$lib/modules/projectiles/factory";
import { PROJECTILE_CONFIG } from "$lib/core/game-config";

export const createTowerAttackSystem = () => {
	const towers = world.with("isTower", "position");
	const enemies = world.with("isEnemy", "position");

	return (dt: number) => {
		for (const tower of towers) {
			const finalStats = tower.finalStats;

			if (tower.towerState === TowerState.COOLDOWN) {
				tower.cooldownTimer = (tower.cooldownTimer ?? 0) - dt;
				if ((tower.cooldownTimer ?? 0) <= 0) {
					tower.towerState = TowerState.IDLE;
					tower.cooldownTimer = 0;
					delete tower.target;
				}
				continue;
			}

			if (tower.towerState === TowerState.FIRING) {
				tower.animationTimer = (tower.animationTimer ?? 0) - dt;
				if ((tower.animationTimer ?? 0) <= 0) {
					const target = tower.target;
					if (
						target &&
						world.has(target) &&
						target.isEnemy &&
						(target.hp ?? 0) > 0
					) {
						createProjectile(
							tower.position!,
							finalStats?.damage ?? 0,
							{ type: "homing", speed: PROJECTILE_CONFIG.speedHoming },
							target,
						);
					}
					tower.towerState = TowerState.COOLDOWN;
					tower.cooldownTimer = finalStats?.attackCooldown ?? 0;
				}
				continue;
			}

			let targetEnemy: ReturnType<typeof world.with>[number] | null = null;
			let minDistance = finalStats?.attackRange ?? 0;

			for (const enemy of enemies) {
				if ((enemy.hp ?? 0) <= 0) continue;

				const dx = (enemy.position?.x ?? 0) - (tower.position?.x ?? 0);
				const dy = (enemy.position?.y ?? 0) - (tower.position?.y ?? 0);
				const dz = (enemy.position?.z ?? 0) - (tower.position?.z ?? 0);
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (
					distance <= (finalStats?.attackRange ?? 0) &&
					distance < minDistance
				) {
					minDistance = distance;
					targetEnemy = enemy;
				}
			}

			if (targetEnemy) {
				tower.towerState = TowerState.FIRING;
				tower.target = targetEnemy;
				tower.animationTimer = tower.attackAnimationDuration;
			}
		}
	};
};
