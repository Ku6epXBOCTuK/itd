import { world } from "$lib/core/world";

export const IncomeSystem = (deltaTime: number) => {
	const players = world.with("player", "gold", "incomePerSecond");

	for (const player of players) {
		const income = (player.incomePerSecond * deltaTime) / 1000;
		player.gold += income;
	}
};
