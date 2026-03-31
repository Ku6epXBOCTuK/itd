export const EnemyState = {
	MOVING: "moving",
	ATTACKING: "attacking",
	COOLDOWN: "cooldown",
} as const;

export const EnemyType = {
	BASIC: "basic",
	FAST: "fast",
	TANK: "tank",
} as const;

export type EnemyTypeKey = keyof typeof EnemyType;
export type EnemyStateKey = keyof typeof EnemyState;

export type Enemy = {
	type: EnemyTypeKey;
	state: EnemyStateKey;
	speed: number;
	maxHp: number;
	currentHp: number;
	damage: number;
	attackRange: number;
	attackCooldown: number;
	attackDuration: number;
	attackStartTime: number;
	target: { x: number; y: number; z: number };
};
