import * as THREE from "three";
import {
	SHARED_GEOMETRIES,
	SHARED_ENEMY_MATERIALS,
	SHARED_TOWER_MATERIAL,
	SHARED_TOWER_BROKEN_MATERIAL,
	SHARED_PROJECTILE_MATERIAL,
} from "$lib/core/game-config";
import { createHpBarSprite } from "$lib/modules/shared/components/hp-bar";
import { world, type Entity, EnemyState, TowerState } from "$lib/core/world";

const entityToObject3D = new WeakMap<Entity, THREE.Object3D>();
const entityToSprite = new WeakMap<Entity, THREE.Sprite>();

export const ViewBridge = {
	createEnemyMesh(state: string) {
		const mesh = new THREE.Mesh(
			SHARED_GEOMETRIES.enemy,
			SHARED_ENEMY_MATERIALS[state as keyof typeof SHARED_ENEMY_MATERIALS] ||
				SHARED_ENEMY_MATERIALS[EnemyState.MOVING],
		);
		mesh.castShadow = true;
		return mesh;
	},

	createProjectileMesh() {
		const mesh = new THREE.Mesh(
			SHARED_GEOMETRIES.projectile,
			SHARED_PROJECTILE_MATERIAL,
		);
		mesh.castShadow = true;
		return mesh;
	},

	createTowerMesh(isBroken: boolean) {
		return new THREE.Mesh(
			SHARED_GEOMETRIES.tower,
			isBroken ? SHARED_TOWER_BROKEN_MATERIAL : SHARED_TOWER_MATERIAL,
		);
	},

	attach(entity: Entity, object: THREE.Object3D) {
		entityToObject3D.set(entity, object);
	},

	detach(entity: Entity) {
		const object = entityToObject3D.get(entity);
		if (object) {
			object.removeFromParent();
			entityToObject3D.delete(entity);
		}
		const sprite = entityToSprite.get(entity);
		if (sprite) {
			sprite.removeFromParent();
			sprite.material.dispose();
			entityToSprite.delete(entity);
		}
	},

	getObject3D(entity: Entity) {
		return entityToObject3D.get(entity);
	},

	getSprite(entity: Entity) {
		return entityToSprite.get(entity);
	},

	setSprite(entity: Entity, sprite: THREE.Sprite) {
		entityToSprite.set(entity, sprite);
	},

	initEntity(entity: Entity, scene: THREE.Scene) {
		if (!entity.position) return;

		if (entity.isEnemy && !entityToObject3D.has(entity)) {
			const mesh = this.createEnemyMesh(entity.enemyState ?? EnemyState.MOVING);
			mesh.position.set(
				entity.position.x,
				entity.position.y,
				entity.position.z,
			);
			scene.add(mesh);
			entityToObject3D.set(entity, mesh);

			const sprite = createHpBarSprite();
			sprite.position.set(
				entity.position.x,
				entity.position.y + 1.0,
				entity.position.z,
			);
			scene.add(sprite);
			entityToSprite.set(entity, sprite);
		}

		if (entity.isProjectile && !entityToObject3D.has(entity)) {
			const mesh = this.createProjectileMesh();
			mesh.position.set(
				entity.position.x,
				entity.position.y,
				entity.position.z,
			);
			scene.add(mesh);
			entityToObject3D.set(entity, mesh);
		}

		if (entity.isTower && !entityToObject3D.has(entity)) {
			const isBroken = entity.towerState === TowerState.BROKEN;
			const mesh = this.createTowerMesh(isBroken);
			mesh.position.set(
				entity.position.x,
				entity.position.y,
				entity.position.z,
			);
			mesh.castShadow = true;
			scene.add(mesh);
			entityToObject3D.set(entity, mesh);
		}
	},

	syncEntity(entity: Entity) {
		if (!entity.position) return;

		const object = entityToObject3D.get(entity);
		if (object) {
			object.position.set(
				entity.position.x,
				entity.position.y,
				entity.position.z,
			);
		}

		if (entity.isEnemy) {
			const mesh = entityToObject3D.get(entity) as THREE.Mesh;
			if (mesh) {
				const materialKey = entity.isDying
					? EnemyState.DYING
					: (entity.enemyState ?? EnemyState.MOVING);
				mesh.material = SHARED_ENEMY_MATERIALS[materialKey];
			}

			const sprite = entityToSprite.get(entity);
			if (sprite) {
				sprite.position.set(
					entity.position.x,
					entity.position.y + 1.0,
					entity.position.z,
				);
				sprite.visible = !entity.isDying;

				const hpPercent = (entity.hp ?? 0) / (entity.maxHp ?? 1);
				(
					sprite.material as unknown as THREE.ShaderMaterial
				).uniforms.uHpPercent.value = hpPercent;
			}
		}

		if (entity.isTower) {
			const mesh = entityToObject3D.get(entity) as THREE.Mesh;
			if (mesh) {
				mesh.material =
					entity.towerState === TowerState.BROKEN
						? SHARED_TOWER_BROKEN_MATERIAL
						: SHARED_TOWER_MATERIAL;
			}
		}
	},
};
