import { resetHudState } from "$lib/adapters/ui-state/hud-state.svelte";
import { resumeGame } from "$lib/core/app-state.svelte";
import { WaveStatus, world, type Player } from "$lib/core/world";
import { resetAttackSystem } from "$lib/modules/enemies/systems/attack.system";
import { createTower } from "$lib/modules/towers/factories";
import { GAME_CONFIG } from "./game-config";

export const createGameState = () => {
	world.add({
		player: {
			player: true,
			gold: GAME_CONFIG.initialGold,
			incomePerSecond: GAME_CONFIG.initialIncomePerSecond,
			upgrades: {
				upgrades: true,
				towerDamageFlatLevel: 2,
				towerDamagePercentLevel: 3,
			},
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
