import { world } from "$lib/core/world";
import { GAME_CONFIG } from "$lib/core/game-config";

export const createTargetingSystem = () => {
	const homingProjectiles = world.with("isProjectile", "position");

	return (_dt: number) => {
		for (const projectile of homingProjectiles) {
			if (projectile.projectileType !== "homing") continue;

			const needsNewTarget =
				!projectile.target ||
				!world.has(projectile.target) ||
				!projectile.target.isEnemy ||
				(projectile.target.hp ?? 0) <= 0;

			if (needsNewTarget) {
				const enemies = world.with("isEnemy", "position");
				let nearest: ReturnType<typeof world.with>[number] | null = null;
				let minDistance: number = GAME_CONFIG.targetingMinDistance;

				for (const enemy of enemies) {
					if ((enemy.hp ?? 0) <= 0) continue;

					const dx = (enemy.position?.x ?? 0) - (projectile.position?.x ?? 0);
					const dy = (enemy.position?.y ?? 0) - (projectile.position?.y ?? 0);
					const dz = (enemy.position?.z ?? 0) - (projectile.position?.z ?? 0);
					const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

					if (distance < minDistance) {
						minDistance = distance;
						nearest = enemy;
					}
				}

				projectile.target = nearest ?? undefined;
			}
		}
	};
};
