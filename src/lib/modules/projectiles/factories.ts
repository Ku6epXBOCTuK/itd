import { world, type Position, type View } from "$lib/core/world";
import * as THREE from "three";

export const createProjectile = (
	scene: THREE.Scene,
	startPos: Position,
	targetId: number,
	damage: number,
) => {
	const geometry = new THREE.SphereGeometry(0.2, 8, 8);
	const material = new THREE.MeshStandardMaterial({
		color: 0xff4444,
		emissive: 0xff0000,
		emissiveIntensity: 0.5,
	});
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.copy(startPos);
	mesh.castShadow = true;
	scene.add(mesh);

	return world.add({
		position: startPos,
		view: { mesh, originalColor: 0xff4444 } as View,
		projectile: {
			projectile: true,
			damage,
			targetId,
		},
	});
};
