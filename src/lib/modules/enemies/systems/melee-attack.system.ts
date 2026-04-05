import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { AttackVariant } from "$lib/modules/shared/components";

export function createMeleeAttackSystem(world: World<Entity>) {
	const attackers = world.with("executeAttack");

	return () => {
		for (const entity of attackers) {
			if (entity.executeAttack?.attackVariant !== AttackVariant.MELEE) {
				continue;
			}

			const towers = world.with("towerTag", "hp");
			const tower = towers.first;
			if (tower) {
				tower.hp = Math.max(0, tower.hp - entity.executeAttack.damage);
			}
		}
	};
}
