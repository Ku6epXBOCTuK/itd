import { World } from "miniplex";
import * as THREE from "three";

// ============ COMPONENT TYPES ============

export const TowerState = {
	IDLE: "idle",
	AIMING: "aiming",
	FIRING: "firing",
	COOLDOWN: "cooldown",
	BROKEN: "broken", // Башня разрушена
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
	WAITING: "waiting",
	SPAWNING: "spawning",
	CLEARING: "clearing",
	COMPLETED: "completed",
} as const;

export type WaveStatusType = (typeof WaveStatus)[keyof typeof WaveStatus];

// ============ ENTITY COMPONENTS ============

export type Position = { x: number; y: number; z: number };

export type View = {
	mesh: THREE.Mesh;
	originalColor: number;
};

export type Player = {
	player: true;
	gold: number;
	incomePerSecond: number;
};

export type Tower = {
	tower: true;
	hp: number;
	maxHp: number;
	damage: number;
	attackRange: number;
	attackCooldown: number;
	attackAnimationDuration: number;
	towerState: TowerStateType;
	attackStartTime: number;
	target?: Entity;
};

export type Enemy = {
	enemy: true;
	type: EnemyVariantType;
	enemyState: EnemyStateType;
	speed: number;
	hp: number;
	maxHp: number;
	damage: number;
	attackRange: number;
	attackCooldown: number;
	attackDuration: number;
	attackStartTime: number;
	deathStartTime: number;
	target: { x: number; y: number; z: number };
	sprite?: THREE.Sprite;
};

export type Homing = {
	homing: true;
	speed: number;
};

export type Ballistic = {
	ballistic: true;
	speed: number;
};

export type Orbit = {
	orbit: true;
	speed: number;
	radius: number;
	center: Position;
};

export type Projectile = {
	projectile: true;
	damage: number;
	target: Entity | null;
	targetPosition: Position | null;
	lifetime: number;
	createdAt: number;
};

export type Settings = {
	settings: true;
	showHpBar: boolean;
};

export type InScene = {
	inScene: true;
};

export type WaveControl = {
	waveControl: true;
	currentWave: number;
	status: WaveStatusType;
	spawnTimer: number;
	remainingEnemies: number;
	waveDelayTimer: number;
	announcementText: string;
};

// ============ UNIFIED ENTITY TYPE ============
// Все компоненты опциональны, сущности могут иметь любой набор компонентов
export type Entity = {
	position?: Position;
	view?: View;
	player?: Player;
	tower?: Tower;
	enemy?: Enemy;
	projectile?: Projectile;
	homing?: Homing;
	ballistic?: Ballistic;
	orbit?: Orbit;
	settings?: Settings;
	waveControl?: WaveControl;
	inScene?: InScene;
};

// ============ MINIPLEX WORLD ============
export const world = new World<Entity>();
