import { world } from "$lib/core/world";
import { uiState } from "$lib/adapters/ui-state/game-state.svelte";

export const createGameState = () => {
	world.add({
		gold: 100,
		incomePerSecond: 10,
	});

	uiState.gold = 100;
	uiState.wave = 1;
};
