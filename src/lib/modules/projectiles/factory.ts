import type { Position, Entity, TargetableEntity } from "$lib/core/world";
import type { World } from "miniplex";
import { ViewId } from "$lib/modules/render/components";
import { type ProjectileVariantType } from "$lib/modules/projectiles/components";

export const createProjectile = (
	world: World<Entity>,
	startPos: Position,
	damage: number,
	behavior: {
		type: ProjectileVariantType;
		speed: number;
		radius?: number;
		center?: Position;
	},
	target: TargetableEntity | undefined = undefined,
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
