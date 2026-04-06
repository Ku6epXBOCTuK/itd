import type { BaseContext } from "$lib/modules/shared/context";
import type { Entity } from "$lib/core/world";
import { AttackPhase } from "$lib/modules/shared/components";

export function createTowerAISystem(ctx: BaseContext) {
	const towersQuery = ctx.world.with(
		"towerTag",
		"position",
		"attackStats",
		"attackRange",
	);
	const enemies = ctx.world.with("enemyTag", "position", "hp");

	return () => {
		const tower = towersQuery.first;
		if (!tower) return;

		if (tower.activeAttack || tower.attackCooldownTimer) return;

		const attackRange = tower.attackRange;
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
			tower.target = targetEnemy;
			ctx.world.addComponent(tower, "activeAttack", {
				attackPhase: AttackPhase.WINDUP,
				timer: tower.attackStats.windupDuration,
			});
		}
	};
}
