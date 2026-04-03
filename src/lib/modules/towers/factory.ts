import {
	TowerState,
	world,
	type Position,
	type DirtyStatsTag,
	type TowerStats,
} from "$lib/core/world";
import { TOWER_CONFIG } from "$lib/core/game-config";

export const createTower = (x: number, z: number) => {
	const tower = world.add({
		position: { x, y: 1, z } as Position,
		tower: {
			tower: true,
			baseStats: {
				hp: TOWER_CONFIG.hp,
				maxHp: TOWER_CONFIG.maxHp,
				damage: TOWER_CONFIG.damage,
				attackRange: TOWER_CONFIG.attackRange,
				attackCooldown: TOWER_CONFIG.attackCooldown,
			},
			finalStats: {} as TowerStats,
			attackAnimationDuration: TOWER_CONFIG.attackAnimationDuration,
			towerState: TowerState.IDLE,
			cooldownTimer: 0,
			animationTimer: 0,
			target: undefined,
		},
		dirtyStats: {
			dirtyStats: true,
		} as DirtyStatsTag,
	});

	return tower;
};
