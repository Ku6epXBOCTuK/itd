import { world } from "$lib/core/world";

export const IncomeSystem = (deltaTime: number) => {
	const players = world.with("player");

	for (const player of players) {
		const income = (player.player.incomePerSecond * deltaTime) / 1000;
		player.player.gold += income;
	}
};
