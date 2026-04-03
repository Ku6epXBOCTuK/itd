import { world, WaveStatus } from "$lib/core/world";
import { WAVE_CONFIG, WAVE_DEFINITIONS } from "$lib/core/game-config";
import { GameEngine, GameEvents } from "$lib/core/event-bus";

export const createWaveSystem = () => {
	const waveControlQuery = world.with("waveControl");
	const enemiesQuery = world.with("isEnemy");

	return (dt: number) => {
		const waveControl = waveControlQuery.first;
		if (!waveControl) return;

		const aliveEnemies = Array.from(enemiesQuery).filter((e) => !e.isDying);

		const status = waveControl.waveControl.status;

		if (status === WaveStatus.PREPARING) {
			waveControl.waveControl.waveDelayTimer -= dt;
			if (waveControl.waveControl.waveDelayTimer <= 0) {
				const waveIndex = Math.min(
					waveControl.waveControl.currentWave - 1,
					WAVE_DEFINITIONS.length - 1,
				);
				const waveDef = WAVE_DEFINITIONS[waveIndex];
				const totalEnemies = waveDef.enemies.reduce(
					(sum, e) => sum + e.count,
					0,
				);

				waveControl.waveControl.remainingEnemies = totalEnemies;
				waveControl.waveControl.spawnTimer = 0;
				waveControl.waveControl.status = WaveStatus.SPAWNING;
				GameEngine.emit(GameEvents.WAVE_START, {
					waveNumber: waveControl.waveControl.currentWave,
				});
			}
		}

		if (status === WaveStatus.WAITING) {
			if (
				aliveEnemies.length === 0 &&
				waveControl.waveControl.remainingEnemies === 0
			) {
				GameEngine.emit(GameEvents.WAVE_COMPLETE, {
					waveNumber: waveControl.waveControl.currentWave,
				});
				waveControl.waveControl.currentWave++;
				waveControl.waveControl.status = WaveStatus.PREPARING;
				waveControl.waveControl.waveDelayTimer = WAVE_CONFIG.delayBetweenWaves;
			}
		}
	};
};
