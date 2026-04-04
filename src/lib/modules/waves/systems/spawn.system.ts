import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { WaveStatus } from "$lib/core/world";
import {
	ENEMY_SPAWN,
	WAVE_CONFIG,
	WAVE_DEFINITIONS,
} from "$lib/core/game-config";
import { createEnemy } from "$lib/modules/enemies/factory";

export function createSpawnSystem(world: World<Entity>) {
	const waveControlQuery = world.with("waveControl");

	return (dt: number) => {
		const waveControl = waveControlQuery.first;
		if (!waveControl) return;
		if (waveControl.waveControl.status !== WaveStatus.SPAWNING) return;

		const waveIndex = Math.min(
			waveControl.waveControl.currentWave - 1,
			WAVE_DEFINITIONS.length - 1,
		);
		const waveDef = WAVE_DEFINITIONS[waveIndex];

		waveControl.waveControl.spawnTimer -= dt;

		if (waveControl.waveControl.spawnTimer <= 0) {
			const spawnPositions: Array<{ x: number; z: number }> = [];

			for (const enemyDef of waveDef.enemies) {
				for (let i = 0; i < enemyDef.count; i++) {
					const angle = Math.random() * Math.PI * 2;
					const x = Math.cos(angle) * ENEMY_SPAWN.radius;
					const z = Math.sin(angle) * ENEMY_SPAWN.radius;
					spawnPositions.push({ x, z });
				}
			}

			const totalSpawned =
				waveDef.enemies.reduce((sum, e) => sum + e.count, 0) -
				waveControl.waveControl.remainingEnemies;

			if (totalSpawned < spawnPositions.length) {
				const pos = spawnPositions[totalSpawned];
				createEnemy(waveDef.enemies[0].type, pos.x, pos.z);
				waveControl.waveControl.remainingEnemies--;
			}

			waveControl.waveControl.spawnTimer = WAVE_CONFIG.delayBetweenSpawns;

			if (waveControl.waveControl.remainingEnemies === 0) {
				waveControl.waveControl.status = WaveStatus.WAITING;
			}
		}
	};
}
