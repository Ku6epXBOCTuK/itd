import {
	TowerState,
	AttackPhase,
	AttackVariant,
	world,
	type Position,
	type AttackState,
} from "$lib/core/world";
import { TOWER_CONFIG } from "$lib/core/game-config";
import { ViewId, VisualStatus } from "$lib/modules/render/components";

export const createTower = (x: number, z: number) => {
	const towerState: AttackState = {
		attackPhase: AttackPhase.COOLDOWN,
		timer: 0,
		type: AttackVariant.PROJECTILE,
		windupDuration: TOWER_CONFIG.windupDuration,
		recoveryDuration: TOWER_CONFIG.recoveryDuration,
		cooldownDuration: TOWER_CONFIG.attackCooldown,
	};

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
		attackState: towerState,
		towerState: TowerState.IDLE,
	});

	return tower;
};
