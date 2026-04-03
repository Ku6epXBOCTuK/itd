import { world } from "$lib/core/world";

export const createIncomeSystem = () => {
	const players = world.with("gold", "incomePerSecond");

	return (_dt: number) => {
		for (const player of players) {
			player.gold += player.incomePerSecond;
		}
	};
};
