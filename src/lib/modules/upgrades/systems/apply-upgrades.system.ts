import { world } from "$lib/core/world";
import { UPGRADES } from "$lib/core/game-config";
import { PERCENT } from "$lib/core/constants";

export const createApplyUpgradesSystem = () => {
	const upgradesQuery = world.with("upgrades");
	const towers = world.with("isTower");

	return (_dt: number) => {
		const upgradesEntity = upgradesQuery.first;
		if (!upgradesEntity?.upgrades?.dirty) return;

		const upgrades = upgradesEntity.upgrades;
		const flatBonus =
			upgrades.towerDamageFlatLevel * UPGRADES.TOWER_DAMAGE_FLAT.bonusPerLevel;
		const percentBonus =
			upgrades.towerDamagePercentLevel *
			UPGRADES.TOWER_DAMAGE_PERCENT.bonusPerLevel;

		for (const tower of towers) {
			const base = tower.baseStats;
			if (!base) continue;
			tower.finalStats = {
				hp: base.hp,
				maxHp: base.maxHp,
				damage: (base.damage + flatBonus) * (1 + percentBonus / PERCENT),
				attackRange: base.attackRange,
				attackCooldown: base.attackCooldown,
			};
		}

		upgrades.dirty = false;
	};
};
