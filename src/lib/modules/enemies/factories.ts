import { world } from "$lib/core/world";
import * as THREE from "three";

const enemyTypes = {
	basic: { speed: 2, maxHp: 100, damage: 10, attackRange: 1.5 },
	fast: { speed: 4, maxHp: 50, damage: 5, attackRange: 1.5 },
	tank: { speed: 1, maxHp: 200, damage: 20, attackRange: 1.5 },
};

export const createEnemy = (
	scene: THREE.Scene,
	type: "basic" | "fast" | "tank",
	x: number,
	z: number,
) => {
	const stats = enemyTypes[type];

	const geometry = new THREE.SphereGeometry(0.5, 16, 16);
	const color = type === "basic" ? 0xff0000 : type === "fast" ? 0xffa500 : 0x8b0000;
	const material = new THREE.MeshStandardMaterial({ color });
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, 0.5, z);
	mesh.castShadow = true;
	scene.add(mesh);

	return world.add({
		type,
		position: { x, y: 0.5, z },
		speed: stats.speed,
		maxHp: stats.maxHp,
		currentHp: stats.maxHp,
		damage: stats.damage,
		attackRange: stats.attackRange,
		target: { x: 0, y: 1, z: 0 },
		view: { mesh },
	});
};
