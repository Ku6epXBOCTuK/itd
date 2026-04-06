import type { BaseContext } from "$lib/modules/shared/context";
import { hudState } from "$lib/adapters/ui-state/hud-state.svelte";

export function createUpdateHudSystem(ctx: BaseContext) {
	const world = ctx.world;
	const players = world.with("gold");
	const towersQuery = world.with("towerTag", "hp", "maxHp");
	const waveControlQuery = world.with("waveControl");

	return (_dt: number) => {
		const player = players.first;
		if (player) {
			hudState.gold = Math.floor(player.gold);
		}

		const tower = towersQuery.first;
		if (tower) {
			hudState.towerHp = Math.floor(tower.hp);
			hudState.towerMaxHp = Math.floor(tower.maxHp);
		}

		const waveControl = waveControlQuery.first;
		if (waveControl) {
			hudState.wave = waveControl.waveControl.currentWave;
		}
	};
}
