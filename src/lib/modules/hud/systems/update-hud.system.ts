import { world } from "$lib/core/world";
import { hudState } from "$lib/adapters/ui-state/hud-state.svelte";

export const createUpdateHudSystem = () => {
	const players = world.with("isPlayer");
	const towers = world.with("isTower");
	const waveControlQuery = world.with("waveControl");

	return (_dt: number) => {
		for (const player of players) {
			hudState.gold = Math.floor(player.gold ?? 0);
		}

		for (const tower of towers) {
			hudState.towerHp = Math.floor(
				tower.finalStats?.hp ?? tower.baseStats?.hp ?? 0,
			);
			hudState.towerMaxHp = Math.floor(
				tower.finalStats?.maxHp ?? tower.baseStats?.maxHp ?? 0,
			);
		}

		const waveControl = waveControlQuery.first;
		if (waveControl) {
			hudState.wave = waveControl.waveControl.currentWave;
		}
	};
};
