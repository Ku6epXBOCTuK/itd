import { World } from "miniplex";

export const TowerState = {
	IDLE: "idle",
	AIMING: "aiming",
	FIRING: "firing",
	COOLDOWN: "cooldown",
	BROKEN: "broken",
} as const;

export type TowerStateType = (typeof TowerState)[keyof typeof TowerState];

export const EnemyState = {
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

export const WaveStatus = {
	PREPARING: "preparing",
	SPAWNING: "spawning",
	WAITING: "waiting",
} as const;

export type WaveStatusType = (typeof WaveStatus)[keyof typeof WaveStatus];

export type Position = { x: number; y: number; z: number };

export type InScene = {
	inScene: true;
};

export type Entity = {
	position?: Position;
	viewId?: string;
	inScene?: InScene;

	isPlayer?: true;
	isTower?: true;
	isEnemy?: true;
	isProjectile?: true;
	isTargetable?: true;
	isDying?: true;
	isDead?: true;

	gold?: number;
	incomePerSecond?: number;
	upgrades?: {
		towerDamageFlatLevel: number;
		towerDamagePercentLevel: number;
	};

	hp?: number;
	maxHp?: number;
	damage?: number;
	speed?: number;
	attackRange?: number;
	attackCooldown?: number;

	towerState?: TowerStateType;
	enemyState?: EnemyStateType;
	enemyVariant?: EnemyVariantType;
	projectileType?: "homing" | "ballistic" | "orbit";

	cooldownTimer?: number;
	attackTimer?: number;
	attackDuration?: number;
	animationTimer?: number;
	attackAnimationDuration?: number;

	baseStats?: {
		hp: number;
		maxHp: number;
		damage: number;
		attackRange: number;
		attackCooldown: number;
	};
	finalStats?: {
		hp: number;
		maxHp: number;
		damage: number;
		attackRange: number;
		attackCooldown: number;
	};

	target?: Entity;
	targetPosition?: Position;
	radius?: number;
	center?: Position;
	lifetime?: number;

	experienceValue?: number;
	deathTimer?: number;

	waveControl?: {
		waveControl: true;
		currentWave: number;
		status: WaveStatusType;
		spawnTimer: number;
		remainingEnemies: number;
		waveDelayTimer: number;
	};

	settings?: {
		settings: true;
		showHpBar: boolean;
	};

	dirtyStats?: {
		dirtyStats: true;
	};
};

export const world = new World<Entity>();
