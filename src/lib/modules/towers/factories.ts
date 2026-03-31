import { world } from "$lib/core/world";
import * as THREE from "three";
import { uiState } from "$lib/adapters/ui-state/game-state.svelte";

export const createTower = (scene: THREE.Scene, x: number, z: number) => {
	const geometry = new THREE.BoxGeometry(1, 2, 1);
	const material = new THREE.MeshStandardMaterial({ color: 0x4a4a4a });
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, 1, z);
	mesh.castShadow = true;
	scene.add(mesh);

	const tower = world.add({
		position: { x, y: 1, z },
		view: { mesh },
		tower: true,
		hp: 500,
		maxHp: 500,
	});

	uiState.towerHp = tower.hp;
	uiState.towerMaxHp = tower.maxHp;

	return tower;
};
