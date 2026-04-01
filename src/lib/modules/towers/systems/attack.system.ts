import { world, TowerState, ProjectileMode } from "$lib/core/world";
import { createProjectile } from "$lib/modules/projectiles/factories";
import * as THREE from "three";

let scene: THREE.Scene | null = null;

export const setTowerScene = (s: THREE.Scene) => {
	scene = s;
};

export const TowerAttackSystem = (deltaTime: number) => {
	const currentTime = Date.now();
	const towers = world.with("tower", "position");
	const enemies = world.with("enemy", "position");

	for (const tower of towers) {
		if (tower.tower.towerState === TowerState.COOLDOWN) {
			const cooldownElapsed = currentTime - tower.tower.attackStartTime;
			if (cooldownElapsed >= tower.tower.attackCooldown) {
				tower.tower.towerState = TowerState.IDLE;
				tower.tower.targetId = undefined;
			}
			continue;
		}

		if (tower.tower.towerState === TowerState.FIRING) {
			const animationElapsed = currentTime - tower.tower.attackStartTime;
			if (animationElapsed >= tower.tower.attackAnimationDuration) {
				const targetId = tower.tower.targetId;
				if (targetId !== undefined) {
					const targetEnemy = world.entity(targetId);
					if (targetEnemy && targetEnemy.enemy && targetEnemy.enemy.hp > 0) {
						if (scene) {
							createProjectile(
								scene,
								tower.position,
								tower.tower.damage,
								ProjectileMode.HOMING,
								targetId,
							);
						}
					}
				}
				tower.tower.towerState = TowerState.COOLDOWN;
				tower.tower.attackStartTime = currentTime;
			}
			continue;
		}

		let targetEnemy: ReturnType<typeof world.with>[number] | null = null;
		let minDistance = tower.tower.attackRange;

		for (const enemy of enemies) {
			if (enemy.enemy.hp <= 0) continue;

			const dx = enemy.position.x - tower.position.x;
			const dy = enemy.position.y - tower.position.y;
			const dz = enemy.position.z - tower.position.z;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance <= tower.tower.attackRange && distance < minDistance) {
				minDistance = distance;
				targetEnemy = enemy;
			}
		}

		if (targetEnemy) {
			tower.tower.towerState = TowerState.FIRING;
			tower.tower.targetId = (targetEnemy as any).id;
			tower.tower.attackStartTime = currentTime;
		}
	}
};
