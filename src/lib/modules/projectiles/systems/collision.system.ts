import { world, EnemyState } from "$lib/core/world";
import * as THREE from "three";
import { GameEngine, GameEvents } from "$lib/core/event-bus";

const HIT_THRESHOLD = 0.3;

export const CollisionSystem = () => {
	const projectiles = world.with("projectile", "position", "view");

	for (const projectile of projectiles) {
		const target = projectile.projectile.target;
		const targetPos = projectile.projectile.targetPosition;

		if (targetPos && !target) {
			const dx = targetPos.x - projectile.position.x;
			const dy = targetPos.y - projectile.position.y;
			const dz = targetPos.z - projectile.position.z;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance < HIT_THRESHOLD || projectile.position.y <= 0) {
				GameEngine.emit(GameEvents.PROJECTILE_MISS, { position: projectile.position });

				if (projectile.view) {
					projectile.view.mesh.removeFromParent();
					projectile.view.mesh.geometry.dispose();
					(projectile.view.mesh.material as THREE.Material).dispose();
				}
				world.remove(projectile);
				continue;
			}
		}

		if (target) {
			if (!world.has(target) || !target.position) {
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

			if (distance < HIT_THRESHOLD) {
				if (target.enemy) {
					target.enemy.hp = Math.max(0, target.enemy.hp - projectile.projectile.damage);

					GameEngine.emit(GameEvents.ENEMY_HIT, {
						targetId: (target as any).id,
						damage: projectile.projectile.damage,
					});

					if (target.enemy.hp <= 0) {
						target.enemy.enemyState = EnemyState.DYING;
						target.enemy.deathStartTime = Date.now();
					}
				}

				if (projectile.view) {
					projectile.view.mesh.removeFromParent();
					projectile.view.mesh.geometry.dispose();
					(projectile.view.mesh.material as THREE.Material).dispose();
				}
				world.remove(projectile);
			}
		}
	}
};
