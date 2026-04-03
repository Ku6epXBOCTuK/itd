import { world } from "$lib/core/world";
import { hudState } from "$lib/adapters/ui-state/hud-state.svelte";

export const createUpdateHudSystem = () => {
	const players = world.with("player");
	const towers = world.with("tower");
	const waveControlQuery = world.with("waveControl");

	return (_dt: number) => {
		for (const player of players) {
			hudState.gold = Math.floor(player.player.gold);
		}

		for (const tower of towers) {
			hudState.towerHp = Math.floor(tower.tower.finalStats.hp);
			hudState.towerMaxHp = Math.floor(tower.tower.finalStats.maxHp);
		}

		const waveControl = waveControlQuery.first;
		if (waveControl) {
			hudState.wave = waveControl.waveControl.currentWave;
		}
	};
};
