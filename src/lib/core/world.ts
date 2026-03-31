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
	HAPPY: "happy", // Враг радуется победе
} as const;

export type EnemyStateType = (typeof EnemyState)[keyof typeof EnemyState];

export const EnemyVariant = {
	BASIC: "basic",
	FAST: "fast",
	TANK: "tank",
} as const;

export type EnemyVariantType = (typeof EnemyVariant)[keyof typeof EnemyVariant];

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
	targetId?: number;
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
	target: { x: number; y: number; z: number };
};

export type Projectile = {
	projectile: true;
	damage: number;
	targetId: number;
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
};

// ============ MINIPLEX WORLD ============
export const world = new World<Entity>();
