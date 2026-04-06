import type { Entity } from "$lib/core/world";
import type { World } from "miniplex";
import { GAME_CONFIG, INITIAL_UPGRADES } from "$lib/core/game-config";

export function createPlayer(world: World<Entity>) {
	world.add({
		gold: GAME_CONFIG.initialGold,
		incomePerSecond: GAME_CONFIG.initialIncomePerSecond,
		upgrades: {
			...INITIAL_UPGRADES,
		},
	});
}
