import { world, EnemyVariant, type Player } from "$lib/core/world";
import { resumeGame } from "$lib/core/app-state.svelte";
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
		player: {
			player: true,
			gold: 100,
			incomePerSecond: 10,
		} as Player,
	});
};

export const spawnInitialEnemies = () => {
	if (!scene) {
		return;
	}

	createEnemy(scene, EnemyVariant.BASIC, 5, 5);
};

export const resetGameState = () => {
	clearGameEntities();
	resetAttackSystem();

	world.clear();
	resumeGame();
};

export const initializeGameState = () => {
	createGameState();

	if (scene) {
		createTower(scene, 0, 0);
		spawnInitialEnemies();
	}
};
