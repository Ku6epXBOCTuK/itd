import { world } from "$lib/core/world";
import { hudState } from "$lib/adapters/ui-state/hud-state.svelte";

export const UpdateHudSystem = () => {
	const players = world.with("player");
	const towers = world.with("tower", "hp", "maxHp");

	for (const player of players) {
		hudState.gold = Math.floor(player.gold ?? 0);
	}

	for (const tower of towers) {
		hudState.towerHp = Math.floor(tower.hp ?? 0);
		hudState.towerMaxHp = Math.floor(tower.maxHp ?? 0);
	}
};
