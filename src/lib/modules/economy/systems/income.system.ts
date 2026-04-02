import { world } from "$lib/core/world";

export const IncomeSystem = (_deltaTime: number) => {
	const players = world.with("player");
	for (const player of players) {
		player.player.gold += player.player.incomePerSecond;
	}
};
