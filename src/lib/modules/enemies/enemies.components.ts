export type EnemyType = "basic" | "fast" | "tank";

export type Enemy = {
	type: EnemyType;
	speed: number;
	maxHp: number;
	currentHp: number;
	damage: number;
	attackRange: number;
	target: { x: number; y: number; z: number };
};
