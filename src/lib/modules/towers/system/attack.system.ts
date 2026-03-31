import { world, TowerState } from "$lib/core/world";
import { createProjectile } from "$lib/modules/projectiles/factories";
import * as THREE from "three";

let scene: THREE.Scene | null = null;

export const setTowerScene = (s: THREE.Scene) => {
	scene = s;
};

export const TowerAttackSystem = (deltaTime: number) => {
	const currentTime = Date.now();
	const towers = world.with("tower", "x", "y", "z", "damage", "attackRange", "attackCooldown", "attackAnimationDuration", "towerState", "attackStartTime", "targetId");
	const enemies = world.with("enemy", "hp", "x", "y", "z");

	for (const tower of towers) {
		if (tower.towerState === TowerState.COOLDOWN) {
			const cooldownElapsed = currentTime - tower.attackStartTime;
			if (cooldownElapsed >= tower.attackCooldown) {
				tower.towerState = TowerState.IDLE;
				(tower.targetId as number | undefined) = undefined;
			}
			continue;
		}

		if (tower.towerState === TowerState.FIRING) {
			const animationElapsed = currentTime - tower.attackStartTime;
			if (animationElapsed >= tower.attackAnimationDuration) {
				if (tower.targetId !== undefined) {
					const targetEnemy = world.entity(tower.targetId);
					if (targetEnemy && targetEnemy.hp !== undefined && targetEnemy.hp > 0) {
						if (scene) {
							createProjectile(
								scene,
								{ x: tower.x!, y: tower.y!, z: tower.z! },
								tower.targetId,
								tower.damage!,
							);
						}
					}
				}
				tower.towerState = TowerState.COOLDOWN;
				tower.attackStartTime = currentTime;
			}
			continue;
		}

		let targetEnemy: ReturnType<typeof world.with>[number] | null = null;
		let minDistance = tower.attackRange!;

		for (const enemy of enemies) {
			if ((enemy.hp ?? 0) <= 0) continue;

			const dx = (enemy.x ?? 0) - (tower.x ?? 0);
			const dy = (enemy.y ?? 0) - (tower.y ?? 0);
			const dz = (enemy.z ?? 0) - (tower.z ?? 0);
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (distance <= (tower.attackRange ?? 0) && distance < minDistance) {
				minDistance = distance;
				targetEnemy = enemy;
			}
		}

		if (targetEnemy) {
			tower.towerState = TowerState.FIRING;
			tower.targetId = targetEnemy.id;
			tower.attackStartTime = currentTime;
		}
	}
};
