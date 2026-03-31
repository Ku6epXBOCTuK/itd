import { world, EnemyVariant, type Player } from "$lib/core/world";
import { resumeGame } from "$lib/core/app-state.svelte";
import { hudState } from "$lib/adapters/ui-state/hud-state.svelte";
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

	hudState.gold = 0;
	hudState.wave = 0;
	hudState.towerHp = 0;
	hudState.towerMaxHp = 0;

	resumeGame();
};

export const initializeGameState = () => {
	createGameState();

	if (scene) {
		createTower(scene, 0, 0);
		spawnInitialEnemies();
	}
};
