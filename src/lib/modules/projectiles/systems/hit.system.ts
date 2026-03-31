import { world } from "$lib/core/world";
import * as THREE from "three";

export const HitSystem = () => {
	const projectiles = world.with("projectile", "x", "y", "z", "damage", "targetId", "mesh", "originalColor");

	for (const projectile of projectiles) {
		const target = world.entity(projectile.targetId!);

		if (!target || target.x === undefined || target.y === undefined || target.z === undefined) {
			if (projectile.mesh) {
				projectile.mesh.removeFromParent();
				projectile.mesh.geometry.dispose();
				(projectile.mesh.material as THREE.Material).dispose();
			}
			world.remove(projectile);
			continue;
		}

		const targetHp = target.hp ?? 0;
		if (targetHp <= 0) {
			if (projectile.mesh) {
				projectile.mesh.removeFromParent();
				projectile.mesh.geometry.dispose();
				(projectile.mesh.material as THREE.Material).dispose();
			}
			world.remove(projectile);
			continue;
		}

		const dx = target.x - (projectile.x ?? 0);
		const dy = target.y - (projectile.y ?? 0);
		const dz = target.z - (projectile.z ?? 0);
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

		if (distance < 0.3) {
			target.hp = Math.max(0, targetHp - (projectile.damage ?? 0));

			if (projectile.mesh) {
				projectile.mesh.removeFromParent();
				projectile.mesh.geometry.dispose();
				(projectile.mesh.material as THREE.Material).dispose();
			}
			world.remove(projectile);
		}
	}
};
