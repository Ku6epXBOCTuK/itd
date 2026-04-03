import * as THREE from "three";
import {
	SHARED_GEOMETRIES,
	SHARED_ENEMY_MATERIALS,
	SHARED_TOWER_MATERIAL,
	SHARED_TOWER_BROKEN_MATERIAL,
	SHARED_PROJECTILE_MATERIAL,
} from "$lib/core/game-config";
import { TowerState, type Entity } from "$lib/core/world";
import {
	ViewId,
	VisualStatus,
	type ViewIdType,
} from "$lib/modules/render/components";

const entityToObject3D = new WeakMap<Entity, THREE.Object3D>();

const VIEW_CONSTRUCTORS: Record<
	ViewIdType,
	(entity: Entity) => THREE.Object3D
> = {
	[ViewId.ENEMY]: (entity) => {
		const materialKey = entity.visualStatus ?? VisualStatus.MOVING;
		return new THREE.Mesh(
			SHARED_GEOMETRIES.enemy,
			SHARED_ENEMY_MATERIALS[
				materialKey as keyof typeof SHARED_ENEMY_MATERIALS
			] || SHARED_ENEMY_MATERIALS.moving,
		);
	},
	[ViewId.PROJECTILE]: () =>
		new THREE.Mesh(SHARED_GEOMETRIES.projectile, SHARED_PROJECTILE_MATERIAL),
	[ViewId.TOWER]: (entity) =>
		new THREE.Mesh(
			SHARED_GEOMETRIES.tower,
			entity.towerState === TowerState.BROKEN
				? SHARED_TOWER_BROKEN_MATERIAL
				: SHARED_TOWER_MATERIAL,
		),
};

export const ViewBridge = {
	detach(entity: Entity) {
		const object = entityToObject3D.get(entity);
		if (object) {
			object.removeFromParent();
			entityToObject3D.delete(entity);
		}
	},

	getObject3D(entity: Entity) {
		return entityToObject3D.get(entity);
	},

	initEntity(entity: Entity, scene: THREE.Scene) {
		if (!entity.position || !entity.viewId) return;
		if (entityToObject3D.has(entity)) return;

		const constructor = VIEW_CONSTRUCTORS[entity.viewId];
		if (!constructor) return;

		const mesh = constructor(entity);
		mesh.position.set(entity.position.x, entity.position.y, entity.position.z);
		if (entity.isTower) mesh.castShadow = true;
		scene.add(mesh);
		entityToObject3D.set(entity, mesh);
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
				const materialKey = entity.visualStatus ?? VisualStatus.MOVING;
				mesh.material =
					SHARED_ENEMY_MATERIALS[
						materialKey as keyof typeof SHARED_ENEMY_MATERIALS
					] || SHARED_ENEMY_MATERIALS.moving;
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
