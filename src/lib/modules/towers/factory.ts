import { TowerState, world, type Position } from "$lib/core/world";
import { TOWER_CONFIG } from "$lib/core/game-config";

export const createTower = (x: number, z: number) => {
	const tower = world.add({
		position: { x, y: 1, z } as Position,
		isTower: true,
		isTargetable: true,
		baseStats: {
			hp: TOWER_CONFIG.hp,
			maxHp: TOWER_CONFIG.maxHp,
			damage: TOWER_CONFIG.damage,
			attackRange: TOWER_CONFIG.attackRange,
			attackCooldown: TOWER_CONFIG.attackCooldown,
		},
		finalStats: {
			hp: TOWER_CONFIG.hp,
			maxHp: TOWER_CONFIG.maxHp,
			damage: TOWER_CONFIG.damage,
			attackRange: TOWER_CONFIG.attackRange,
			attackCooldown: TOWER_CONFIG.attackCooldown,
		},
		attackAnimationDuration: TOWER_CONFIG.attackAnimationDuration,
		towerState: TowerState.IDLE,
		cooldownTimer: 0,
		animationTimer: 0,
		dirtyStats: {
			dirtyStats: true,
		},
	});

	return tower;
};
