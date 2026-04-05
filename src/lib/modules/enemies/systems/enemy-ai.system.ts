import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { EnemyState } from "$lib/modules/enemies/components";
import { GAME_CONFIG } from "$lib/core/game-config";

export function createEnemyAISystem(world: World<Entity>) {
	const enemies = world
		.with("enemyTag", "position", "targetPosition", "maxSpeed")
		.without("dyingTag");

	return (_dt: number) => {
		for (const enemy of enemies) {
			if (enemy.enemyState === EnemyState.HAPPY) continue;

			const dx = enemy.targetPosition.x - enemy.position.x;
			const dy = enemy.targetPosition.y - enemy.position.y;
			const dz = enemy.targetPosition.z - enemy.position.z;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance > GAME_CONFIG.targetReachedDistance) {
				enemy.velocity = {
					x: (dx / distance) * enemy.maxSpeed,
					y: (dy / distance) * enemy.maxSpeed,
					z: (dz / distance) * enemy.maxSpeed,
				};
			}
		}
	};
}
