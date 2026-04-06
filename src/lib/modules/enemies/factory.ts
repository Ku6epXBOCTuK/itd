import {
	EnemyState,
	EnemyVariant,
	type Vector3,
	type Entity,
} from "$lib/core/world";
import type { EnemyVariantType } from "$lib/modules/enemies/components";
import type { World } from "miniplex";
import { ENEMY_CONFIGS, ENEMY_SPAWN, GAME_CONFIG } from "$lib/core/game-config";
import { ViewId, VisualStatus } from "$lib/modules/render/components";

export { EnemyVariant };

type EnemyStats = (typeof ENEMY_CONFIGS)[EnemyVariantType];

export const createEnemy = (
	world: World<Entity>,
	type: keyof typeof ENEMY_CONFIGS,
	x: number,
	z: number,
) => {
	const stats = ENEMY_CONFIGS[type] as EnemyStats;

	const enemy = world.add({
		position: { x, y: ENEMY_SPAWN.y, z } as Vector3,
		viewId: ViewId.ENEMY,
		visualStatus: VisualStatus.MOVING,
		enemyTag: true,
		targetableTag: true,
		enemyVariant: type as EnemyVariantType,
		enemyState: EnemyState.MOVING,
		attackStats: stats.attackStats,
		maxSpeed: stats.speed,
		friction: GAME_CONFIG.baseFriction * stats.frictionModifier,
		velocity: { x: 0, y: 0, z: 0 },
		hp: stats.hp,
		maxHp: stats.maxHp,
		damage: stats.damage,
		attackRange: stats.attackRange,
		targetPosition: { x: 0, y: 1, z: 0 },
	});

	return enemy;
};
