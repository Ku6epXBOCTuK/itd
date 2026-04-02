import { world, WaveStatus, type Player } from "$lib/core/world";
import { WAVE_CONFIG } from "$lib/core/game-config";
import { resumeGame } from "$lib/core/app-state.svelte";
import { hudState } from "$lib/adapters/ui-state/hud-state.svelte";
import { createTower } from "$lib/modules/towers/factories";
import { clearGameEntities } from "$lib/modules/render/systems/sync-render.system";
import { resetAttackSystem } from "$lib/modules/enemies/systems/attack.system";

export const createGameState = () => {
	world.add({
		player: {
			player: true,
			gold: 100,
			incomePerSecond: 10,
		} as Player,
	});

	world.add({
		settings: {
			settings: true,
			showHpBar: true,
		},
	});

	world.add({
		waveControl: {
			waveControl: true,
			currentWave: 1,
			status: WaveStatus.PREPARING,
			spawnTimer: 0,
			remainingEnemies: 0,
			waveDelayTimer: 0,
		},
	});
};

export const resetGameState = () => {
	clearGameEntities();
	resetAttackSystem();

	world.clear();

	hudState.gold = 0;
	hudState.wave = 0;
	hudState.towerHp = 0;
	hudState.towerMaxHp = 0;

	resumeGame();
};

export const initializeGameState = () => {
	createGameState();
	createTower(0, 0);
};
