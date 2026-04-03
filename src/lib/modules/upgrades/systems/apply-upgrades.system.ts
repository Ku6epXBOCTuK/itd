import { world } from "$lib/core/world";
import { UPGRADES } from "$lib/core/game-config";
import { PERCENT } from "$lib/core/constants";

export const createApplyUpgradesSystem = () => {
	const players = world.with("isPlayer");
	const towers = world.with("isTower", "dirtyStats");

	return (_dt: number) => {
		for (const player of players) {
			const flatBonus =
				(player.upgrades?.towerDamageFlatLevel ?? 0) *
				UPGRADES.TOWER_DAMAGE_FLAT.bonusPerLevel;
			const percentBonus =
				(player.upgrades?.towerDamagePercentLevel ?? 0) *
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

				world.removeComponent(tower, "dirtyStats");
			}
		}
	};
};
