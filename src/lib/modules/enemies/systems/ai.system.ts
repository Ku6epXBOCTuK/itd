import type { TargetableEntity } from "$lib/core/world";
import { EnemyState } from "$lib/modules/enemies/components";
import { AttackPhase } from "$lib/modules/shared/components";
import type { BaseContext } from "$lib/modules/shared/context";

export function createEnemyAISystem(ctx: BaseContext) {
	const enemies = ctx.world
		.with(
			"enemyTag",
			"position",
			"targetPosition",
			"maxSpeed",
			"attackStats",
			"attackRange",
			"enemyState",
			"searchTimer",
		)
		.without("dyingTag");
	const towers = ctx.world.with("towerTag", "position", "hp", "targetableTag");

	return (dt: number) => {
		for (const enemy of enemies) {
			if (enemy.enemyState === EnemyState.HAPPY) continue;

			if (enemy.enemyState === EnemyState.IDLE) {
				if (enemy.searchTimer) {
					enemy.searchTimer -= dt;
					if (enemy.searchTimer <= 0) {
						const tower = towers.first;
						if (tower) {
							enemy.target = tower as TargetableEntity;
							enemy.enemyState = EnemyState.MOVING;
							enemy.targetPosition = {
								x: tower.position.x,
								y: tower.position.y,
								z: tower.position.z,
							};
						}
					}
				}
			}

			if (enemy.enemyState === EnemyState.MOVING) {
				if (!enemy.target || !ctx.world.has(enemy.target)) {
					enemy.enemyState = EnemyState.IDLE;
					enemy.searchTimer = 500;
					enemy.target = undefined;
					continue;
				}

				const dx = (enemy.target.position?.x ?? 0) - (enemy.position?.x ?? 0);
				const dy = (enemy.target.position?.y ?? 0) - (enemy.position?.y ?? 0);
				const dz = (enemy.target.position?.z ?? 0) - (enemy.position?.z ?? 0);
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (distance > enemy.attackRange) {
					enemy.velocity = {
						x: (dx / distance) * enemy.maxSpeed,
						y: (dy / distance) * enemy.maxSpeed,
						z: (dz / distance) * enemy.maxSpeed,
					};
				}

				if (distance <= enemy.attackRange) {
					if (!enemy.activeAttack && !enemy.attackCooldownTimer) {
						ctx.world.addComponent(enemy, "activeAttack", {
							attackPhase: AttackPhase.WINDUP,
							timer: enemy.attackStats.windupDuration,
						});
					}
				}
			}
		}
	};
}
