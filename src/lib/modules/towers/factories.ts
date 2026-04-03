import {
	TowerState,
	world,
	type Position,
	type DirtyStatsTag,
	type TowerStats,
} from "$lib/core/world";

export const createTower = (x: number, z: number) => {
	const tower = world.add({
		position: { x, y: 1, z } as Position,
		tower: {
			tower: true,
			baseStats: {
				hp: 500,
				maxHp: 500,
				damage: 25,
				attackRange: 10,
				attackCooldown: 1000,
			},
			finalStats: {} as TowerStats,
			attackAnimationDuration: 300,
			towerState: TowerState.IDLE,
			attackStartTime: 0,
			target: undefined,
		},
		dirtyStats: {
			dirtyStats: true,
		} as DirtyStatsTag,
	});

	return tower;
};
