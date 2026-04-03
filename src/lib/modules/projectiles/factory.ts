import { world, type Position, type Entity } from "$lib/core/world";

export const createProjectile = (
	startPos: Position,
	damage: number,
	behavior: {
		type: "homing" | "ballistic" | "orbit";
		speed: number;
		radius?: number;
		center?: Position;
	},
	target: Entity | undefined = undefined,
	targetPosition: Position | undefined = undefined,
	lifetime: number = 2000,
) => {
	const projectile = world.add({
		position: { x: startPos.x, y: startPos.y, z: startPos.z },
		isProjectile: true,
		damage,
		target,
		targetPosition,
		lifetime,
		projectileType: behavior.type,
		speed: behavior.speed,
		radius: behavior.radius,
		center: behavior.center,
	});

	return projectile;
};
