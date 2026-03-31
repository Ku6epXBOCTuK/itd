import { world, TowerState, type Position, type View } from "$lib/core/world";
import * as THREE from "three";
import { setTowerScene } from "./system/attack.system";

export const createTower = (scene: THREE.Scene, x: number, z: number) => {
	setTowerScene(scene);

	const geometry = new THREE.BoxGeometry(1, 2, 1);
	const material = new THREE.MeshStandardMaterial({ color: 0x4a4a4a });
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, 1, z);
	mesh.castShadow = true;
	scene.add(mesh);

	const tower = world.add({
		position: { x, y: 1, z } as Position,
		view: { mesh, originalColor: 0x4a4a4a } as View,
		tower: {
			tower: true,
			hp: 500,
			maxHp: 500,
			damage: 25,
			attackRange: 4,
			attackCooldown: 1000,
			attackAnimationDuration: 300,
			towerState: TowerState.IDLE,
			attackStartTime: 0,
			targetId: undefined,
		},
	});

	return tower;
};
