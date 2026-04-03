import { resetHudState } from "$lib/adapters/ui-state/hud-state.svelte";
import { resumeGame } from "$lib/core/app-state.svelte";
import { WaveStatus, world } from "$lib/core/world";
import { resetAttackSystem } from "$lib/modules/enemies/systems/attack.system";
import { createTower } from "$lib/modules/towers/factory";
import { createPlayer } from "$lib/modules/player/factory";
import { GAME_CONFIG } from "./game-config";

export const createGameState = () => {
	createPlayer();

	world.add({
		settings: {
			settings: true,
			showHpBar: true,
		},
	});

	world.add({
		waveControl: {
			waveControl: true,
			currentWave: GAME_CONFIG.initialWave,
			status: WaveStatus.PREPARING,
			spawnTimer: 0,
			remainingEnemies: 0,
			waveDelayTimer: 0,
		},
	});
};

export const resetGameState = () => {
	resetAttackSystem();

	world.clear();

	resetHudState();

	resumeGame();
};

export const initializeGameState = () => {
	createGameState();
	createTower(0, 0);
};
