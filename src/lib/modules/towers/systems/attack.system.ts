import { world, TowerState } from "$lib/core/world";
import { createProjectile } from "$lib/modules/projectiles/factories";

export const TowerAttackSystem = (_deltaTime: number) => {
	const currentTime = Date.now();
	const towers = world.with("tower", "position");
	const enemies = world.with("enemy", "position");

	for (const tower of towers) {
		const finalStats = tower.tower.finalStats;

		if (tower.tower.towerState === TowerState.COOLDOWN) {
			const cooldownElapsed = currentTime - tower.tower.attackStartTime;
			if (cooldownElapsed >= finalStats.attackCooldown) {
				tower.tower.towerState = TowerState.IDLE;
				tower.tower.target = undefined;
			}
			continue;
		}

		if (tower.tower.towerState === TowerState.FIRING) {
			const animationElapsed = currentTime - tower.tower.attackStartTime;
			if (animationElapsed >= tower.tower.attackAnimationDuration) {
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
						{ homing: true, speed: 8 },
						target,
					);
				}
				tower.tower.towerState = TowerState.COOLDOWN;
				tower.tower.attackStartTime = currentTime;
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
			tower.tower.attackStartTime = currentTime;
		}
	}
};
