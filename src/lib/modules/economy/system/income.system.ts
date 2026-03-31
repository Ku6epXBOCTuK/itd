import { world } from "$lib/core/world";
import { uiState } from "$lib/adapters/ui-state/game-state.svelte";

export const IncomeSystem = (deltaTime: number) => {
	const players = world.with("gold", "incomePerSecond");

	for (const player of players) {
		const income = (player.incomePerSecond * deltaTime) / 1000;
		player.gold += income;

		uiState.gold = Math.floor(player.gold);
	}
};
