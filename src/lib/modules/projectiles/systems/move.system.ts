import { world, ProjectileMode } from "$lib/core/world";

const SPEED = 8;
const HIT_THRESHOLD = 0.3;

const findNearestEnemy = (position: { x: number; y: number; z: number }, maxRange: number) => {
	const enemies = world.with("enemy", "position");
	let nearest: ReturnType<typeof world.with>[number] | null = null;
	let minDistance = maxRange;

	for (const enemy of enemies) {
		if (enemy.enemy.hp <= 0) continue;

		const dx = enemy.position.x - position.x;
		const dy = enemy.position.y - position.y;
		const dz = enemy.position.z - position.z;
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

		if (distance < minDistance) {
			minDistance = distance;
			nearest = enemy;
		}
	}

	return nearest;
};

export const ProjectileMoveSystem = (deltaTime: number) => {
	const projectiles = world.with("projectile", "position");
	const currentTime = Date.now();

	for (const projectile of projectiles) {
		const lifetimeElapsed = currentTime - projectile.projectile.createdAt;
		if (lifetimeElapsed >= projectile.projectile.lifetime) {
			continue;
		}

		if (projectile.projectile.mode === ProjectileMode.HOMING) {
			let target = projectile.projectile.targetId !== null
				? world.entity(projectile.projectile.targetId)
				: null;

			if (!target || !target.position || target.enemy?.hp === 0) {
				const newTarget = findNearestEnemy(projectile.position, 5);
				if (newTarget) {
					projectile.projectile.targetId = (newTarget as any).id;
					target = newTarget;
				} else {
					projectile.projectile.targetId = null;
				}
			}

			if (!target || !target.position) {
				continue;
			}

			const dx = target.position.x - projectile.position.x;
			const dy = target.position.y - projectile.position.y;
			const dz = target.position.z - projectile.position.z;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance < HIT_THRESHOLD) {
				continue;
			}

			const direction = {
				x: dx / distance,
				y: dy / distance,
				z: dz / distance,
			};

			const moveDistance = SPEED * (deltaTime / 1000);
			projectile.position.x += direction.x * moveDistance;
			projectile.position.y += direction.y * moveDistance;
			projectile.position.z += direction.z * moveDistance;
		}

		if (projectile.projectile.mode === ProjectileMode.DIRECT) {
			const targetPos = projectile.projectile.targetPosition;
			if (!targetPos) {
				continue;
			}

			const dx = targetPos.x - projectile.position.x;
			const dy = targetPos.y - projectile.position.y;
			const dz = targetPos.z - projectile.position.z;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance < HIT_THRESHOLD || projectile.position.y <= 0) {
				continue;
			}

			const direction = {
				x: dx / distance,
				y: dy / distance,
				z: dz / distance,
			};

			const moveDistance = SPEED * (deltaTime / 1000);
			projectile.position.x += direction.x * moveDistance;
			projectile.position.y += direction.y * moveDistance;
			projectile.position.z += direction.z * moveDistance;
		}
	}
};
