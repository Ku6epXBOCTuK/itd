import { world } from "$lib/core/world";
import { UPGRADES } from "$lib/core/game-config";
import { PERCENT } from "$lib/core/constants";

export const createApplyUpgradesSystem = () => {
	const players = world.with("player");
	const towers = world.with("tower", "dirtyStats");

	return (_dt: number) => {
		for (const player of players) {
			const flatBonus =
				player.player.upgrades.towerDamageFlatLevel *
				UPGRADES.TOWER_DAMAGE_FLAT.bonusPerLevel;
			const percentBonus =
				player.player.upgrades.towerDamagePercentLevel *
				UPGRADES.TOWER_DAMAGE_PERCENT.bonusPerLevel;

			for (const tower of towers) {
				const base = tower.tower.baseStats;
				tower.tower.finalStats = {
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
