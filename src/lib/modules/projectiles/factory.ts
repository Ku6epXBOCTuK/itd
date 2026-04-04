import { world, type Position, type Entity } from "$lib/core/world";
import { ViewId } from "$lib/modules/render/components";
import {
	ProjectileVariant,
	type ProjectileVariantType,
} from "$lib/modules/projectiles/components";

export const createProjectile = (
	startPos: Position,
	damage: number,
	behavior: {
		type: ProjectileVariantType;
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
		viewId: ViewId.PROJECTILE,
		projectileTag: true,
		damage,
		target,
		targetPosition,
		lifetime,
		projectileVariant: behavior.type,
		speed: behavior.speed,
		radius: behavior.radius,
		center: behavior.center,
	});

	return projectile;
};
