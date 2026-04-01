import { world, type Position, type View, type Entity } from "$lib/core/world";
import * as THREE from "three";
import {
	SHARED_GEOMETRIES,
	SHARED_PROJECTILE_MATERIAL,
} from "$lib/core/game-config";

type ProjectileBehavior =
	| { homing: true; speed: number }
	| { ballistic: true; speed: number }
	| { orbit: true; speed: number; radius: number; center: Position };

export const createProjectile = (
	startPos: Position,
	damage: number,
	behavior: ProjectileBehavior,
	target: Entity | null = null,
	targetPosition: Position | null = null,
	lifetime: number = 2000,
) => {
	const mesh = new THREE.Mesh(
		SHARED_GEOMETRIES.projectile,
		SHARED_PROJECTILE_MATERIAL,
	);
	mesh.position.copy(startPos);
	mesh.castShadow = true;

	const projectile = world.add({
		position: { x: startPos.x, y: startPos.y, z: startPos.z },
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

	return projectile;
};
