import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { AttackPhase } from "$lib/core/world";
import { createProjectile } from "$lib/modules/projectiles/factory";
import { PROJECTILE_CONFIG } from "$lib/core/game-config";

export function createTowerAttackSystem(world: World<Entity>) {
	const towersQuery = world.with(
		"towerTag",
		"position",
		"damage",
		"attackRange",
		"attackState",
	);
	const enemies = world.with("enemyTag", "position", "hp");

	return (dt: number) => {
		const tower = towersQuery.first;
		if (!tower) return;

		const damage = tower.damage;
		const attackRange = tower.attackRange;
		const attackState = tower.attackState!;

		attackState.timer -= dt;

		if (attackState.timer <= 0) {
			if (attackState.attackPhase === AttackPhase.WINDUP) {
				attackState.attackPhase = AttackPhase.RECOVER;
				attackState.timer = attackState.recoveryDuration;
			} else if (attackState.attackPhase === AttackPhase.RECOVER) {
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
				attackState.attackPhase = AttackPhase.COOLDOWN;
				attackState.timer = attackState.cooldownDuration;
			} else if (attackState.attackPhase === AttackPhase.COOLDOWN) {
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
					attackState.attackPhase = AttackPhase.WINDUP;
					tower.target = targetEnemy;
					attackState.timer = attackState.windupDuration;
				} else {
					attackState.attackPhase = AttackPhase.COOLDOWN;
					attackState.timer = 0;
				}
			}
		}
	};
}
