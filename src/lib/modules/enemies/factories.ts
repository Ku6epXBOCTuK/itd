import {
	EnemyState,
	EnemyVariant,
	world,
	type Position,
	type EnemyVariantType,
} from "$lib/core/world";
import { ENEMY_CONFIGS, ENEMY_SPAWN } from "$lib/core/game-config";

export { EnemyVariant };

type EnemyStats = (typeof ENEMY_CONFIGS)[EnemyVariantType];

export const createEnemy = (
	type: keyof typeof ENEMY_CONFIGS,
	x: number,
	z: number,
) => {
	const stats = ENEMY_CONFIGS[type] as EnemyStats;

	const enemy = world.add({
		position: { x, y: ENEMY_SPAWN.y, z } as Position,
		enemy: {
			enemy: true,
			type: type as EnemyVariantType,
			enemyState: EnemyState.MOVING,
			speed: stats.speed,
			hp: stats.hp,
			maxHp: stats.maxHp,
			damage: stats.damage,
			attackRange: stats.attackRange,
			attackCooldown: stats.attackCooldown,
			attackDuration: stats.attackDuration,
			attackStartTime: 0,
			deathStartTime: 0,
			target: { x: 0, y: 1, z: 0 },
			sprite: undefined,
		},
	});

	return enemy;
};
