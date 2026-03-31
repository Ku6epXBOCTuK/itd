import { world, resumeGame, EnemyVariant } from "$lib/core/world";
import { uiState, GameState } from "$lib/adapters/ui-state/game-state.svelte";
import { createEnemy } from "$lib/modules/enemies/factories";
import { createTower } from "$lib/modules/towers/factories";
import { clearGameEntities } from "$lib/modules/render/systems/sync-render.system";
import { resetAttackSystem } from "$lib/modules/enemies/systems/attack.system";
import type { Scene } from "three";

let scene: Scene | null = null;

export const setScene = (s: Scene) => {
	scene = s;
};

export const createGameState = () => {
	world.add({
		gold: 100,
		incomePerSecond: 10,
	});

	uiState.gold = 100;
	uiState.wave = 1;
};

export const spawnInitialEnemies = () => {
	if (!scene) {
		return;
	}

	createEnemy(scene, EnemyVariant.BASIC, 5, 5);

	uiState.wave = 1;
};

export const resetGameState = () => {
	clearGameEntities();
	resetAttackSystem();

	uiState.gold = 0;
	uiState.wave = 0;
	uiState.towerHp = 0;
	uiState.towerMaxHp = 0;

	resumeGame();
};

export const initializeGameState = () => {
	createGameState();
	uiState.towerHp = 500;
	uiState.towerMaxHp = 500;

	if (scene) {
		createTower(scene, 0, 0);
		spawnInitialEnemies();
	}
};
