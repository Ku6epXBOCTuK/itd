import { TowerState, world, type Position } from "$lib/core/world";

export const createTower = (x: number, z: number) => {
	const tower = world.add({
		position: { x, y: 1, z } as Position,
		tower: {
			tower: true,
			hp: 500,
			maxHp: 500,
			damage: 25,
			attackRange: 10,
			attackCooldown: 1000,
			attackAnimationDuration: 300,
			towerState: TowerState.IDLE,
			attackStartTime: 0,
			target: undefined,
		},
	});

	return tower;
};
