import * as THREE from "three";

export const createGround = (scene: THREE.Scene) => {
	const geometry = new THREE.PlaneGeometry(20, 20);
	const material = new THREE.MeshStandardMaterial({ color: 0x228b22 });
	const mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	scene.add(mesh);
};
