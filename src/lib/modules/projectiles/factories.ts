import { world, type Position, type Entity } from "$lib/core/world";

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
	const projectile = world.add({
		position: { x: startPos.x, y: startPos.y, z: startPos.z },
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
