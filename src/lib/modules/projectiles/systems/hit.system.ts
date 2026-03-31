import { world } from "$lib/core/world";
import * as THREE from "three";

export const HitSystem = () => {
	const projectiles = world.with("projectile", "position", "view");

	for (const projectile of projectiles) {
		const target = world.entity(projectile.projectile.targetId);

		if (!target || !target.position) {
			if (projectile.view) {
				projectile.view.mesh.removeFromParent();
				projectile.view.mesh.geometry.dispose();
				(projectile.view.mesh.material as THREE.Material).dispose();
			}
			world.remove(projectile);
			continue;
		}

		if (target.enemy && target.enemy.hp <= 0) {
			if (projectile.view) {
				projectile.view.mesh.removeFromParent();
				projectile.view.mesh.geometry.dispose();
				(projectile.view.mesh.material as THREE.Material).dispose();
			}
			world.remove(projectile);
			continue;
		}

		const dx = target.position.x - projectile.position.x;
		const dy = target.position.y - projectile.position.y;
		const dz = target.position.z - projectile.position.z;
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

		if (distance < 0.3) {
			if (target.enemy) {
				target.enemy.hp = Math.max(0, target.enemy.hp - projectile.projectile.damage);
			}

			if (projectile.view) {
				projectile.view.mesh.removeFromParent();
				projectile.view.mesh.geometry.dispose();
				(projectile.view.mesh.material as THREE.Material).dispose();
			}
			world.remove(projectile);
		}
	}
};
