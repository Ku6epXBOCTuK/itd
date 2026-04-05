import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { AttackPhase } from "$lib/core/world";
import { ATTACK_WINDUP_RATIO } from "$lib/core/constants";
import { createProjectile } from "$lib/modules/projectiles/factory";
import { PROJECTILE_CONFIG } from "$lib/core/game-config";

export function createTowerAttackSystem(world: World<Entity>) {
	const towersQuery = world.with(
		"towerTag",
		"position",
		"damage",
		"attackRange",
		"attackCooldown",
		"attackPhase",
	);
	const enemies = world.with("enemyTag", "position", "hp");

	return (dt: number) => {
		const tower = towersQuery.first;
		if (!tower) return;

		const damage = tower.damage;
		const attackRange = tower.attackRange;
		const attackCooldown = tower.attackCooldown;
		const attackDuration = tower.attackDuration ?? 0;

		tower.attackTimer = (tower.attackTimer ?? 0) - dt;

		if (tower.attackTimer <= 0) {
			if (tower.attackPhase === AttackPhase.WINDUP) {
				tower.attackPhase = AttackPhase.RECOVER;
				tower.attackTimer = attackDuration * ATTACK_WINDUP_RATIO;
			} else if (tower.attackPhase === AttackPhase.RECOVER) {
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
				tower.attackPhase = AttackPhase.COOLDOWN;
				tower.attackTimer = attackCooldown;
			} else if (tower.attackPhase === AttackPhase.COOLDOWN) {
				let targetEnemy: Entity | undefined = undefined;
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
					tower.attackPhase = AttackPhase.WINDUP;
					tower.target = targetEnemy;
					tower.attackTimer = attackDuration * ATTACK_WINDUP_RATIO;
				} else {
					tower.attackPhase = AttackPhase.COOLDOWN;
					tower.attackTimer = 0;
				}
			}
		}
	};
}
