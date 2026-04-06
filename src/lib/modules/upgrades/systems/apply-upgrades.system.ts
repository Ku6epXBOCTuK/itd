import type { BaseContext } from "$lib/modules/shared/context";
import { UPGRADES } from "$lib/core/game-config";
import { PERCENT } from "$lib/core/constants";

export function createApplyUpgradesSystem(ctx: BaseContext) {
	const world = ctx.world;
	const upgradesQuery = world.with("upgrades");
	const towersQuery = world.with("towerTag", "baseDamage");

	return (_dt: number) => {
		const upgradesEntity = upgradesQuery.first;
		if (!upgradesEntity?.upgrades?.dirty) return;

		const upgrades = upgradesEntity.upgrades;
		const flatBonus =
			upgrades.towerDamageFlatLevel * UPGRADES.TOWER_DAMAGE_FLAT.bonusPerLevel;
		const percentBonus =
			upgrades.towerDamagePercentLevel *
			UPGRADES.TOWER_DAMAGE_PERCENT.bonusPerLevel;

		const tower = towersQuery.first;
		if (tower) {
			tower.damage =
				(tower.baseDamage + flatBonus) * (1 + percentBonus / PERCENT);
		}

		upgrades.dirty = false;
	};
}
