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
		)
		.without("dyingTag");
	const towers = ctx.world.with("towerTag", "position", "hp", "targetableTag");

	return (_dt: number) => {
		for (const enemy of enemies) {
			if (enemy.enemyState === EnemyState.HAPPY) continue;

			const dx = enemy.targetPosition.x - enemy.position.x;
			const dy = enemy.targetPosition.y - enemy.position.y;
			const dz = enemy.targetPosition.z - enemy.position.z;
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
					const tower = towers.first;
					if (tower) {
						enemy.target = tower as TargetableEntity;
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
