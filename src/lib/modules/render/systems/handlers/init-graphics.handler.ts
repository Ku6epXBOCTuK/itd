import { world, EnemyState, TowerState } from "$lib/core/world";
import * as THREE from "three";
import {
	SHARED_GEOMETRIES,
	SHARED_ENEMY_MATERIALS,
	SHARED_TOWER_MATERIAL,
	SHARED_TOWER_BROKEN_MATERIAL,
	SHARED_PROJECTILE_MATERIAL,
} from "$lib/core/game-config";
import { createHpBarSprite } from "$lib/modules/enemies/hp-bar";

const createEnemyMesh = (
	enemyState: (typeof EnemyState)[keyof typeof EnemyState],
) => {
	const mesh = new THREE.Mesh(
		SHARED_GEOMETRIES.enemy,
		SHARED_ENEMY_MATERIALS[enemyState],
	);
	mesh.castShadow = true;
	return mesh;
};

const createProjectileMesh = () => {
	const mesh = new THREE.Mesh(
		SHARED_GEOMETRIES.projectile,
		SHARED_PROJECTILE_MATERIAL,
	);
	mesh.castShadow = true;
	return mesh;
};

const createTowerMesh = (isBroken: boolean) => {
	return new THREE.Mesh(
		SHARED_GEOMETRIES.tower,
		isBroken ? SHARED_TOWER_BROKEN_MATERIAL : SHARED_TOWER_MATERIAL,
	);
};

export const initGraphics = () => {
	const enemiesPendingInit = world.with("enemy", "position").without("view");
	for (const entity of enemiesPendingInit) {
		if (entity.enemy && entity.position) {
			const mesh = createEnemyMesh(entity.enemy.enemyState);
			mesh.position.set(
				entity.position.x,
				entity.position.y,
				entity.position.z,
			);
			const sprite = createHpBarSprite();
			world.addComponent(entity, "view", {
				mesh,
				originalColor: 0x00ff00,
			});
			entity.enemy.sprite = sprite;
		}
	}

	const projectilesPendingInit = world
		.with("projectile", "position")
		.without("view");
	for (const entity of projectilesPendingInit) {
		if (entity.position) {
			const mesh = createProjectileMesh();
			mesh.position.set(
				entity.position.x,
				entity.position.y,
				entity.position.z,
			);
			world.addComponent(entity, "view", {
				mesh,
				originalColor: 0xff4444,
			});
		}
	}

	const towersPendingInit = world.with("tower", "position").without("view");
	for (const entity of towersPendingInit) {
		if (entity.position && entity.tower) {
			const isBroken = entity.tower.towerState === TowerState.BROKEN;
			const mesh = createTowerMesh(isBroken);
			mesh.position.set(
				entity.position.x,
				entity.position.y,
				entity.position.z,
			);
			mesh.castShadow = true;
			world.addComponent(entity, "view", {
				mesh,
				originalColor: 0x4a4a4a,
			});
		}
	}
};
