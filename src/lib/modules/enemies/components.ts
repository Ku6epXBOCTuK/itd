export const EnemyState = {
	IDLE: "idle",
	MOVING: "moving",
	ATTACKING: "attacking",
	COOLDOWN: "cooldown",
	HAPPY: "happy",
	DYING: "dying",
} as const;

export type EnemyStateType = (typeof EnemyState)[keyof typeof EnemyState];

export const EnemyVariant = {
	BASIC: "basic",
	FAST: "fast",
	TANK: "tank",
} as const;

export type EnemyVariantType = (typeof EnemyVariant)[keyof typeof EnemyVariant];
