import { world } from "$lib/core/world";
import { SECOND_MS } from "$lib/core/constants";

export const IncomeSystem = (deltaTime: number) => {
	const players = world.with("player");

	for (const player of players) {
		const income = (player.player.incomePerSecond * deltaTime) / SECOND_MS;
		player.player.gold += income;
	}
};
