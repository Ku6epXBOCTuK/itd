import * as THREE from "three";
import { GEOMETRY, RENDER_CONFIG } from "$lib/core/game-config";

export const createGround = (scene: THREE.Scene) => {
	const geometry = new THREE.PlaneGeometry(
		GEOMETRY.ground.width,
		GEOMETRY.ground.height,
	);
	const material = new THREE.MeshStandardMaterial({
		color: RENDER_CONFIG.ground.color,
	});
	const mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	scene.add(mesh);
};
