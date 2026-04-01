import {
	EnemyState,
	EnemyVariant,
	world,
	type EnemyVariantType,
	type Position,
	type View,
} from "$lib/core/world";
import * as THREE from "three";

export { EnemyVariant };

const enemyTypes = {
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

type EnemyStats = (typeof enemyTypes)[EnemyVariantType];

const enemyColors = {
	[EnemyState.MOVING]: 0x00ff00,
	[EnemyState.ATTACKING]: 0xff4444,
	[EnemyState.COOLDOWN]: 0xffff00,
};

export const createEnemy = (
	scene: THREE.Scene,
	type: keyof typeof enemyTypes,
	x: number,
	z: number,
) => {
	const stats = enemyTypes[type] as EnemyStats;

	const geometry = new THREE.SphereGeometry(0.5, 16, 16);
	const material = new THREE.MeshStandardMaterial({
		color: enemyColors[EnemyState.MOVING],
	});
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, 0.5, z);
	mesh.castShadow = true;
	scene.add(mesh);

	const enemy = world.add({
		position: { x, y: 0.5, z } as Position,
		view: { mesh, originalColor: enemyColors[EnemyState.MOVING] } as View,
		enemy: {
			enemy: true,
			type: type as EnemyVariantType,
			enemyState: EnemyState.MOVING,
			speed: stats.speed,
			hp: stats.hp,
			maxHp: stats.maxHp,
			damage: stats.damage,
			attackRange: stats.attackRange,
			attackCooldown: stats.attackCooldown,
			attackDuration: stats.attackDuration,
			attackStartTime: 0,
			deathStartTime: 0,
			target: { x: 0, y: 1, z: 0 },
		},
	});

	return enemy;
};
