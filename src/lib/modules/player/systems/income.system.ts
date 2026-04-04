import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";

export function createIncomeSystem(world: World<Entity>) {
	const players = world.with("gold", "incomePerSecond");

	return (_dt: number) => {
		for (const player of players) {
			player.gold += player.incomePerSecond;
		}
	};
}
