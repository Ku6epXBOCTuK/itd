import * as THREE from "three";

export const createGround = (scene: THREE.Scene) => {
	const geometry = new THREE.PlaneGeometry(20, 20);
	const material = new THREE.MeshStandardMaterial({ color: 0x228b22 });
	const mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	scene.add(mesh);
};

export const createTower = (scene: THREE.Scene, x: number, z: number) => {
	const geometry = new THREE.BoxGeometry(1, 2, 1);
	const material = new THREE.MeshStandardMaterial({ color: 0x4a4a4a });
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, 1, z);
	mesh.castShadow = true;
	scene.add(mesh);
};
