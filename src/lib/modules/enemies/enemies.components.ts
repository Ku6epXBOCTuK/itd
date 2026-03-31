export type EnemyType = "basic" | "fast" | "tank";
export type EnemyState = "moving" | "attacking" | "cooldown";

export type Enemy = {
	type: EnemyType;
	state: EnemyState;
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
