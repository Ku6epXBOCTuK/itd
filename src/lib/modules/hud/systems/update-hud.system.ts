import { world } from "$lib/core/world";
import { hudState } from "$lib/adapters/ui-state/hud-state.svelte";

export const UpdateHudSystem = () => {
	const players = world.with("player");
	const towers = world.with("tower");
	const waveControl = Array.from(world.with("waveControl"))[0];

	for (const player of players) {
		hudState.gold = Math.floor(player.player.gold);
	}

	for (const tower of towers) {
		hudState.towerHp = Math.floor(tower.tower.hp);
		hudState.towerMaxHp = Math.floor(tower.tower.maxHp);
	}

	if (waveControl) {
		hudState.wave = waveControl.waveControl.currentWave;
	}

	hudState.enemyCount = Array.from(world.with("enemy")).length;
	hudState.projectileCount = Array.from(world.with("projectile")).length;
};
