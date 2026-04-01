import { EnemyState, EnemyVariant, TowerState } from "./world";

export const ENEMY_CONFIGS = {
	[EnemyVariant.BASIC]: {
		speed: 2,
		hp: 100,
		maxHp: 100,
		damage: 10,
		attackRange: 1.5,
		attackCooldown: 1000,
		attackDuration: 300,
	},
	[EnemyVariant.FAST]: {
		speed: 4,
		hp: 50,
		maxHp: 50,
		damage: 50,
		attackRange: 1.5,
		attackCooldown: 500,
		attackDuration: 200,
	},
	[EnemyVariant.TANK]: {
		speed: 1,
		hp: 200,
		maxHp: 200,
		damage: 200,
		attackRange: 1.5,
		attackCooldown: 2000,
		attackDuration: 500,
	},
} as const;

export const ENEMY_COLORS = {
	[EnemyState.MOVING]: 0x00ff00,
	[EnemyState.ATTACKING]: 0xff4444,
	[EnemyState.COOLDOWN]: 0xffff00,
	[EnemyState.HAPPY]: 0x4444ff,
	[EnemyState.DYING]: 0xff69b4,
} as const;

export const TOWER_CONFIG = {
	hp: 1000,
	maxHp: 1000,
	damage: 50,
	attackRange: 3,
	attackCooldown: 1000,
	attackAnimationDuration: 300,
} as const;

export const TOWER_COLORS = {
	[TowerState.IDLE]: 0x4a4a4a,
	[TowerState.BROKEN]: 0xff0000,
} as const;

export const PROJECTILE_CONFIG = {
	speed: 5,
	lifetime: 5000,
} as const;

export const RENDER_CONFIG = {
	camera: {
		fov: 75,
		near: 0.1,
		far: 1000,
		position: { x: 0, y: 10, z: 10 },
	},
	colors: {
		background: 0x1a1a2e,
		ambient: 0xffffff,
		directional: 0xffffff,
	},
	light: {
		ambientIntensity: 0.6,
		directionalIntensity: 0.8,
		directionalPosition: { x: 10, y: 10, z: 5 },
	},
	ground: {
		size: 20,
		color: 0x228b22,
	},
	grid: {
		size: 20,
		divisions: 20,
		colorCenterLine: 0x444444,
		colorGrid: 0x222222,
	},
} as const;

export const GEOMETRY = {
	enemy: {
		radius: 0.5,
		segments: 16,
	},
	projectile: {
		radius: 0.2,
		segments: 8,
		color: 0xff4444,
		emissiveIntensity: 0.5,
	},
	ground: {
		width: 20,
		height: 20,
	},
	hpBar: {
		width: 1.0,
		height: 0.15,
		depth: 1.0,
	},
} as const;

export const GAME_CONFIG = {
	deathAnimationDuration: 500,
	incomeInterval: 1000,
	targetingInterval: 1000,
	targetReachedDistance: 0.5,
	targetingMinDistance: 10,
} as const;

export const ENEMY_SPAWN = {
	y: 0.5,
} as const;

export const WAVE_CONFIG = {
	delayBetweenSpawns: 500,
	delayBetweenWaves: 2000,
	announcementDuration: 2000,
} as const;

export const WAVE_DEFINITIONS = [
	{
		enemies: [{ type: EnemyVariant.BASIC, count: 3 }],
	},
	{
		enemies: [
			{ type: EnemyVariant.BASIC, count: 5 },
			{ type: EnemyVariant.FAST, count: 2 },
		],
	},
	{
		enemies: [
			{ type: EnemyVariant.TANK, count: 2 },
			{ type: EnemyVariant.FAST, count: 4 },
		],
	},
] as const;
