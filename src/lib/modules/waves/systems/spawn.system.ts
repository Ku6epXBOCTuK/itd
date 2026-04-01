import { world, WaveStatus } from "$lib/core/world";
import { SPAWN_X, SPAWN_Z } from "$lib/core/constants";
import { WAVE_CONFIG, WAVE_DEFINITIONS } from "$lib/core/game-config";
import { createEnemy } from "$lib/modules/enemies/factories";
import type { Scene } from "three";

const SPAWN_SPREAD = 4;

let scene: Scene | null = null;

export const setSpawnScene = (s: Scene) => {
	scene = s;
};

export const SpawnSystem = (deltaTime: number) => {
	const waveControl = Array.from(world.with("waveControl"))[0];
	if (!waveControl) return;
	if (waveControl.waveControl.status !== WaveStatus.SPAWNING) return;
	if (!scene) return;

	const waveIndex = Math.min(
		waveControl.waveControl.currentWave,
		WAVE_DEFINITIONS.length - 1,
	);
	const waveDef = WAVE_DEFINITIONS[waveIndex];

	waveControl.waveControl.spawnTimer -= deltaTime;

	if (waveControl.waveControl.spawnTimer <= 0) {
		const spawnPositions: Array<{ x: number; z: number }> = [];

		for (const enemyDef of waveDef.enemies) {
			for (let i = 0; i < enemyDef.count; i++) {
				const x = SPAWN_X + Math.random() * SPAWN_SPREAD - SPAWN_SPREAD / 2;
				const z = SPAWN_Z + Math.random() * SPAWN_SPREAD - SPAWN_SPREAD / 2;
				spawnPositions.push({ x, z });
			}
		}

		const totalSpawned =
			waveDef.enemies.reduce((sum, e) => sum + e.count, 0) -
			waveControl.waveControl.remainingEnemies;

		if (totalSpawned < spawnPositions.length) {
			const pos = spawnPositions[totalSpawned];
			createEnemy(scene, waveDef.enemies[0].type, pos.x, pos.z);
			waveControl.waveControl.remainingEnemies--;
		}

		waveControl.waveControl.spawnTimer = WAVE_CONFIG.delayBetweenSpawns;

		if (waveControl.waveControl.remainingEnemies === 0) {
			waveControl.waveControl.status = WaveStatus.WAITING;
			waveControl.waveControl.announcementText = "";
		}
	}
};
