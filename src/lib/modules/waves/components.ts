export const WaveStatus = {
	PREPARING: "preparing",
	SPAWNING: "spawning",
	WAITING: "waiting",
} as const;

export type WaveStatusType = (typeof WaveStatus)[keyof typeof WaveStatus];

export type WaveControl = {
	waveControl: true;
	currentWave: number;
	status: WaveStatusType;
	spawnTimer: number;
	remainingEnemies: number;
	waveDelayTimer: number;
};
