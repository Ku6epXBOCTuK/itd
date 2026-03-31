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

export type EnemyTypeValue = (typeof EnemyType)[keyof typeof EnemyType];
export type EnemyStateValue = (typeof EnemyState)[keyof typeof EnemyState];

export type Enemy = {
	type: EnemyTypeValue;
	state: EnemyStateValue;
	speed: number;
	hp: number;
	maxHp: number;
	damage: number;
	attackRange: number;
	attackCooldown: number;
	attackDuration: number;
	attackStartTime: number;
	target: { x: number; y: number; z: number };
};
