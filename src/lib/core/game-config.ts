import { VisualStatus } from "$lib/modules/render/components";
import { AttackVariant } from "$lib/modules/shared/components";
import * as THREE from "three";
import { EnemyVariant, TowerState } from "./world";

export const TOWER_CONFIG = {
	hp: 1000,
	maxHp: 1000,
	damage: 50,
	attackRange: 5,
	attackStats: {
		type: AttackVariant.PROJECTILE_HOMING,
		windupDuration: 150,
		recoveryDuration: 150,
		cooldownDuration: 1000,
	},
} as const;

export const UPGRADES = {
	TOWER_DAMAGE_FLAT: {
		bonusPerLevel: 20,
	},
	TOWER_DAMAGE_PERCENT: {
		bonusPerLevel: 10,
	},
} as const;

export const INITIAL_UPGRADES = {
	towerDamageFlatLevel: 2,
	towerDamagePercentLevel: 3,
	dirty: true,
} as const;

export const GAME_CONFIG = {
	deathAnimationDuration: 500,
	incomeInterval: 1000,
	targetingInterval: 1000,
	targetReachedDistance: 0.01,
	targetingMinDistance: 10,
	initialGold: 100,
	initialIncomePerSecond: 10,
	initialWave: 1,
	baseFriction: 20,
	aliveFrictionModifier: 4.0,
} as const;

export const ENEMY_SPAWN = {
	y: 0.5,
	radius: 10,
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

export const ENEMY_CONFIGS = {
	[EnemyVariant.BASIC]: {
		searchTime: 500,
		speed: 2,
		frictionModifier: 1,
		hp: 100,
		maxHp: 100,
		damage: 10,
		attackRange: 1.5,
		attackStats: {
			type: AttackVariant.MELEE,
			windupDuration: 150,
			recoveryDuration: 150,
			cooldownDuration: 1000,
		},
	},
	[EnemyVariant.FAST]: {
		searchTime: 500,
		speed: 4,
		frictionModifier: 0.5,
		hp: 50,
		maxHp: 50,
		damage: 10,
		attackRange: 1.5,
		attackStats: {
			type: AttackVariant.MELEE,
			windupDuration: 100,
			recoveryDuration: 100,
			cooldownDuration: 500,
		},
	},
	[EnemyVariant.TANK]: {
		searchTime: 500,
		speed: 1,
		frictionModifier: 2,
		hp: 200,
		maxHp: 200,
		damage: 20,
		attackRange: 1.5,
		attackStats: {
			type: AttackVariant.MELEE,
			windupDuration: 250,
			recoveryDuration: 250,
			cooldownDuration: 2000,
		},
	},
} as const;

export const PROJECTILE_CONFIG = {
	speed: 5,
	speedHoming: 8,
	lifetime: 5000,
	homingHitThreshold: 0.3,
	ballisticHitThreshold: 0.3,
} as const;

export const ENEMY_COLORS = {
	[VisualStatus.IDLE]: 0xffffff,
	[VisualStatus.MOVING]: 0x00ff00,
	[VisualStatus.ATTACKING]: 0xff4444,
	[VisualStatus.COOLDOWN]: 0xffff00,
	[VisualStatus.HAPPY]: 0x4444ff,
	[VisualStatus.DYING]: 0xff69b4,
} as const;

export const TOWER_COLORS = {
	[TowerState.IDLE]: 0x4a4a4a,
	[TowerState.BROKEN]: 0xff0000,
} as const;

export const RENDER_CONFIG = {
	camera: {
		fov: 75,
		near: 0.1,
		far: 1000,
		position: { x: 0, y: 15, z: 6 },
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
		size: 0.5,
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
} as const;

export const SHARED_GEOMETRIES = {
	enemy: new THREE.BoxGeometry(
		GEOMETRY.enemy.size,
		GEOMETRY.enemy.size,
		GEOMETRY.enemy.size,
	),
	projectile: new THREE.SphereGeometry(
		GEOMETRY.projectile.radius,
		GEOMETRY.projectile.segments,
		GEOMETRY.projectile.segments,
	),
	tower: new THREE.BoxGeometry(1, 2, 1),
} as const;

export const SHARED_ENEMY_MATERIALS = {
	[VisualStatus.IDLE]: new THREE.MeshStandardMaterial({
		color: ENEMY_COLORS[VisualStatus.IDLE],
	}),
	[VisualStatus.MOVING]: new THREE.MeshStandardMaterial({
		color: ENEMY_COLORS[VisualStatus.MOVING],
	}),
	[VisualStatus.ATTACKING]: new THREE.MeshStandardMaterial({
		color: ENEMY_COLORS[VisualStatus.ATTACKING],
	}),
	[VisualStatus.COOLDOWN]: new THREE.MeshStandardMaterial({
		color: ENEMY_COLORS[VisualStatus.COOLDOWN],
	}),
	[VisualStatus.HAPPY]: new THREE.MeshStandardMaterial({
		color: ENEMY_COLORS[VisualStatus.HAPPY],
	}),
	[VisualStatus.DYING]: new THREE.MeshStandardMaterial({
		color: ENEMY_COLORS[VisualStatus.DYING],
	}),
} as const;

export const SHARED_TOWER_MATERIALS = {
	[VisualStatus.IDLE]: new THREE.MeshStandardMaterial({
		color: TOWER_COLORS[TowerState.IDLE],
	}),
	[VisualStatus.ATTACKING]: new THREE.MeshStandardMaterial({
		color: 0xffaa00,
	}),
	[VisualStatus.COOLDOWN]: new THREE.MeshStandardMaterial({
		color: 0x666666,
	}),
} as const;

export const SHARED_TOWER_BROKEN_MATERIAL = new THREE.MeshStandardMaterial({
	color: TOWER_COLORS[TowerState.BROKEN],
});

export const SHARED_PROJECTILE_MATERIAL = new THREE.MeshStandardMaterial({
	color: GEOMETRY.projectile.color,
	emissive: GEOMETRY.projectile.color,
	emissiveIntensity: GEOMETRY.projectile.emissiveIntensity,
});
