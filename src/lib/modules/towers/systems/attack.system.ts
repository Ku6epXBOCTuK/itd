import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { TowerState } from "$lib/core/world";
import { createProjectile } from "$lib/modules/projectiles/factory";
import { PROJECTILE_CONFIG } from "$lib/core/game-config";

export function createTowerAttackSystem(world: World<Entity>) {
	const towersQuery = world.with(
		"towerTag",
		"position",
		"damage",
		"attackRange",
		"attackCooldown",
	);
	const enemies = world.with("enemyTag", "position", "hp");

	return (dt: number) => {
		const tower = towersQuery.first;
		if (!tower) return;

		const damage = tower.damage;
		const attackRange = tower.attackRange;
		const attackCooldown = tower.attackCooldown;

		if (tower.towerState === TowerState.COOLDOWN) {
			tower.cooldownTimer = (tower.cooldownTimer ?? 0) - dt;
			if (tower.cooldownTimer <= 0) {
				tower.towerState = TowerState.IDLE;
				tower.cooldownTimer = 0;
				delete tower.target;
			}
			return;
		}

		if (tower.towerState === TowerState.FIRING) {
			tower.animationTimer = (tower.animationTimer ?? 0) - dt;
			if (tower.animationTimer <= 0) {
				const target = tower.target;
				if (
					target &&
					world.has(target) &&
					target.enemyTag &&
					(target.hp ?? 0) > 0
				) {
					createProjectile(
						tower.position!,
						damage,
						{ type: "homing", speed: PROJECTILE_CONFIG.speedHoming },
						target,
					);
				}
				tower.towerState = TowerState.COOLDOWN;
				tower.cooldownTimer = attackCooldown;
			}
			return;
		}

		let targetEnemy: Entity | null = null;
		let minDistance = attackRange;

		for (const enemy of enemies) {
			if (enemy.hp <= 0) continue;

			const dx = (enemy.position?.x ?? 0) - (tower.position?.x ?? 0);
			const dy = (enemy.position?.y ?? 0) - (tower.position?.y ?? 0);
			const dz = (enemy.position?.z ?? 0) - (tower.position?.z ?? 0);
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance <= attackRange && distance < minDistance) {
				minDistance = distance;
				targetEnemy = enemy;
			}
		}

		if (targetEnemy) {
			tower.towerState = TowerState.FIRING;
			tower.target = targetEnemy;
			tower.animationTimer = tower.attackAnimationDuration;
		}
	};
}
