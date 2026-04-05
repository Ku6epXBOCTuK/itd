import { TowerState, AttackPhase, world, type Position } from "$lib/core/world";
import { TOWER_CONFIG } from "$lib/core/game-config";
import { ViewId, VisualStatus } from "$lib/modules/render/components";

// Одна башня в игре
export const createTower = (x: number, z: number) => {
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
		attackCooldown: TOWER_CONFIG.attackCooldown,
		attackDuration: TOWER_CONFIG.attackDuration,
		towerState: TowerState.IDLE,
		attackPhase: AttackPhase.COOLDOWN,
		attackTimer: 0,
	});

	return tower;
};
