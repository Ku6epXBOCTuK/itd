import { world, type Position, type View, type Entity } from "$lib/core/world";
import * as THREE from "three";
import { GEOMETRY } from "$lib/core/game-config";

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
	const geometry = new THREE.SphereGeometry(
		GEOMETRY.projectile.radius,
		GEOMETRY.projectile.segments,
		GEOMETRY.projectile.segments,
	);
	const material = new THREE.MeshStandardMaterial({
		color: GEOMETRY.projectile.color,
		emissive: GEOMETRY.projectile.color,
		emissiveIntensity: GEOMETRY.projectile.emissiveIntensity,
	});
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.copy(startPos);
	mesh.castShadow = true;
	scene.add(mesh);

	return world.add({
		position: { x: startPos.x, y: startPos.y, z: startPos.z },
		view: { mesh, originalColor: GEOMETRY.projectile.color } as View,
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
