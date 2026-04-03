import { world } from "$lib/core/world";

export const createIncomeSystem = () => {
	const players = world.with("isPlayer");

	return (_dt: number) => {
		for (const player of players) {
			player.gold = (player.gold ?? 0) + (player.incomePerSecond ?? 0);
		}
	};
};
