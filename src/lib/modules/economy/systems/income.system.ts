import { world } from "$lib/core/world";

export const createIncomeSystem = () => {
	const players = world.with("player");

	return (_dt: number) => {
		for (const player of players) {
			player.player.gold += player.player.incomePerSecond;
		}
	};
};
