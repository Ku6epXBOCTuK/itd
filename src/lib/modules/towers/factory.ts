import { TowerState, type Position, type Entity } from "$lib/core/world";
import type { World } from "miniplex";
import { TOWER_CONFIG } from "$lib/core/game-config";
import { ViewId, VisualStatus } from "$lib/modules/render/components";

export const createTower = (world: World<Entity>, x: number, z: number) => {
	const tower = world.add({
		position: { x, y: 1, z } as Position,
		viewId: ViewId.TOWER,
		visualStatus: VisualStatus.IDLE,
		towerTag: true,
		targetableTag: true,
		baseDamage: TOWER_CONFIG.damage,
		damage: TOWER_CONFIG.damage,
		hp: TOWER_CONFIG.hp,
		maxHp: TOWER_CONFIG.maxHp,
		attackRange: TOWER_CONFIG.attackRange,
		attackStats: TOWER_CONFIG.attackStats,
		towerState: TowerState.IDLE,
	});

	return tower;
};
