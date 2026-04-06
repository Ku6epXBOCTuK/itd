export const WaveStatus = {
	PREPARING: "preparing",
	ANNOUNCING: "announcing",
	SPAWNING: "spawning",
	WAITING: "waiting",
	COMPLETED: "completed",
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
