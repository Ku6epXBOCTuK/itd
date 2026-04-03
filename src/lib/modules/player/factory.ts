import { world } from "$lib/core/world";
import { GAME_CONFIG, INITIAL_UPGRADES } from "$lib/core/game-config";
import type { Player } from "./schema";

export function createPlayer() {
	world.add({
		player: {
			player: true,
			gold: GAME_CONFIG.initialGold,
			incomePerSecond: GAME_CONFIG.initialIncomePerSecond,
			upgrades: {
				upgrades: true,
				...INITIAL_UPGRADES,
			},
		} as Player,
	});
}
