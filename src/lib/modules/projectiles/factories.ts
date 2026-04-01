import { world, type Position, type View, type Entity } from "$lib/core/world";
import * as THREE from "three";

type ProjectileBehavior =
	| { homing: true; speed: number }
	| { ballistic: true; speed: number }
	| { orbit: true; speed: number; radius: number; center: Position };

export const createProjectile = (
	scene: THREE.Scene,
	startPos: Position,
	damage: number,
	behavior: ProjectileBehavior,
	target: Entity | null = null,
	targetPosition: Position | null = null,
	lifetime: number = 2000,
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
			target,
			targetPosition,
			lifetime,
			createdAt: Date.now(),
		},
		...("homing" in behavior ? { homing: behavior } : {}),
		...("ballistic" in behavior ? { ballistic: behavior } : {}),
		...("orbit" in behavior ? { orbit: behavior } : {}),
	});
};
