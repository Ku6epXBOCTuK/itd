import { world } from "$lib/core/world";
import * as THREE from "three";
import { EnemyState, EnemyType } from "./enemies.components";

export { EnemyType };

const enemyTypes = {
	basic: {
		speed: 2,
		maxHp: 100,
		damage: 100,
		attackRange: 1.5,
		attackCooldown: 1000,
		attackDuration: 300,
	},
	fast: {
		speed: 4,
		maxHp: 50,
		damage: 50,
		attackRange: 1.5,
		attackCooldown: 500,
		attackDuration: 200,
	},
	tank: {
		speed: 1,
		maxHp: 200,
		damage: 200,
		attackRange: 1.5,
		attackCooldown: 2000,
		attackDuration: 500,
	},
} as const;

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
	const stats = enemyTypes[type];

	const geometry = new THREE.SphereGeometry(0.5, 16, 16);
	const material = new THREE.MeshStandardMaterial({
		color: enemyColors[EnemyState.MOVING],
	});
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, 0.5, z);
	mesh.castShadow = true;
	scene.add(mesh);

	return world.add({
		type,
		state: EnemyState.MOVING,
		position: { x, y: 0.5, z },
		speed: stats.speed,
		maxHp: stats.maxHp,
		currentHp: stats.maxHp,
		damage: stats.damage,
		attackRange: stats.attackRange,
		attackCooldown: stats.attackCooldown,
		attackDuration: stats.attackDuration,
		attackStartTime: 0,
		target: { x: 0, y: 1, z: 0 },
		view: { mesh, originalColor: enemyColors[EnemyState.MOVING] },
	});
};
