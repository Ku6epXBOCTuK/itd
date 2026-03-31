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

// ============ MINIPLEX WORLD ============
// Все компоненты опциональны, сущности могут иметь любой набор компонентов
export const world = new World<{
	// Position
	x?: number;
	y?: number;
	z?: number;

	// View
	mesh?: THREE.Mesh;
	originalColor?: number;

	// Player
	player?: true;
	gold?: number;
	incomePerSecond?: number;

	// Tower
	tower?: true;
	hp?: number;
	maxHp?: number;
	damage?: number;
	attackRange?: number;
	attackCooldown?: number;
	attackAnimationDuration?: number;
	towerState?: TowerStateType;
	attackStartTime?: number;
	targetId?: number;

	// Enemy
	enemy?: true;
	type?: EnemyVariantType;
	enemyState?: EnemyStateType;
	speed?: number;
	attackDuration?: number;
	target?: { x: number; y: number; z: number };

	// Projectile
	projectile?: true;
}>();

// ============ APP STATE ============

export const AppState = {
	IN_GAME: "in_game",
	PAUSED: "paused",
} as const;

export type AppStateType = (typeof AppState)[keyof typeof AppState];

let appState: AppStateType = AppState.IN_GAME;

export const getAppState = (): AppStateType => appState;

export const setAppState = (state: AppStateType) => {
	appState = state;
};

export const pauseGame = () => {
	appState = AppState.PAUSED;
};

export const resumeGame = () => {
	appState = AppState.IN_GAME;
};

export const isPaused = () => appState === AppState.PAUSED;
