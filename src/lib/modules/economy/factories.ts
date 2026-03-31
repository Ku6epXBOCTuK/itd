import { world, resumeGame, EnemyVariant } from "$lib/core/world";
import { uiState, GameState } from "$lib/adapters/ui-state/game-state.svelte";
import { createEnemy } from "$lib/modules/enemies/factories";
import { createTower } from "$lib/modules/towers/factories";
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

export const resetGameState = () => {
	if (scene) {
		const entities = world.with("x", "y", "z", "mesh");
		for (const entity of entities) {
			if (entity.mesh) {
				scene.remove(entity.mesh);
			}
		}
	}

	world.clear();
	uiState.gold = 0;
	uiState.wave = 0;
	uiState.towerHp = 0;
	uiState.towerMaxHp = 0;

	resumeGame();
};

export const initializeGameState = () => {
	resetGameState();
	createGameState();
	uiState.towerHp = 500;
	uiState.towerMaxHp = 500;

	if (scene) {
		createTower(scene, 0, 0);
		createEnemy(scene, EnemyVariant.BASIC, 5, 5);
	}
};
