export const WaveStatus = {
	PREPARING: "preparing",
	SPAWNING: "spawning",
	WAITING: "waiting",
} as const;

export type WaveStatusType = (typeof WaveStatus)[keyof typeof WaveStatus];
