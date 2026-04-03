export const TowerState = {
	IDLE: "idle",
	AIMING: "aiming",
	FIRING: "firing",
	COOLDOWN: "cooldown",
	BROKEN: "broken",
} as const;

export type TowerStateType = (typeof TowerState)[keyof typeof TowerState];
