import { world } from "$lib/core/world";
import { GAME_CONFIG, INITIAL_UPGRADES } from "$lib/core/game-config";

export function createPlayer() {
	world.add({
		isPlayer: true,
		gold: GAME_CONFIG.initialGold,
		incomePerSecond: GAME_CONFIG.initialIncomePerSecond,
		upgrades: {
			...INITIAL_UPGRADES,
		},
	});
}
