import { world } from "$lib/core/world";
import { GAME_CONFIG } from "$lib/core/game-config";

export const createTargetingSystem = () => {
	const homingProjectiles = world.with("projectile", "homing", "position");

	return (_dt: number) => {
		for (const projectile of homingProjectiles) {
			if (!projectile.homing) continue;

			const needsNewTarget =
				!projectile.projectile.target ||
				!world.has(projectile.projectile.target) ||
				!projectile.projectile.target.enemy ||
				projectile.projectile.target.enemy.hp <= 0;

			if (needsNewTarget) {
				const enemies = world.with("enemy", "position");
				let nearest: ReturnType<typeof world.with>[number] | null = null;
				let minDistance: number = GAME_CONFIG.targetingMinDistance;

				for (const enemy of enemies) {
					if (enemy.enemy.hp <= 0) continue;

					const dx = enemy.position.x - projectile.position.x;
					const dy = enemy.position.y - projectile.position.y;
					const dz = enemy.position.z - projectile.position.z;
					const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

					if (distance < minDistance) {
						minDistance = distance;
						nearest = enemy;
					}
				}

				projectile.projectile.target = nearest ?? null;
			}
		}
	};
};
