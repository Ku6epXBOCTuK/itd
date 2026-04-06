import {
	SHARED_ENEMY_MATERIALS,
	SHARED_GEOMETRIES,
	SHARED_PROJECTILE_MATERIAL,
	SHARED_TOWER_BROKEN_MATERIAL,
	SHARED_TOWER_MATERIALS,
} from "$lib/core/game-config";
import type { RenderContext } from "$lib/modules/shared/context";
import type { Entity } from "$lib/core/world";
import { TowerState } from "$lib/core/world";
import type { ViewIdType } from "$lib/modules/render/components";
import { ViewId, VisualStatus } from "$lib/modules/render/components";
import * as THREE from "three";

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
				: SHARED_TOWER_MATERIALS[VisualStatus.IDLE],
		),
};

export function createSyncRenderSystem(ctx: RenderContext) {
	const world = ctx.world;
	const scene = ctx.scene;
	const camera = ctx.camera;
	const renderer = ctx.renderer;
	const entityToObject3D = new WeakMap<Entity, THREE.Object3D>();

	const allWithView = world.with("viewId", "position");
	const enemiesWithView = world.with(
		"enemyTag",
		"viewId",
		"position",
		"visualStatus",
	);
	const towerWithView = world.with(
		"towerTag",
		"viewId",
		"position",
		"visualStatus",
	);

	function attachEntity(entity: Entity) {
		if (!entity.viewId || !entity.position) return;

		const constructor = VIEW_CONSTRUCTORS[entity.viewId];
		if (!constructor) return;

		const mesh = constructor(entity);
		mesh.position.copy(entity.position as THREE.Vector3);
		if (entity.towerTag) mesh.castShadow = true;
		scene.add(mesh);
		entityToObject3D.set(entity, mesh);
	}

	function detachEntity(entity: Entity) {
		const mesh = entityToObject3D.get(entity);
		if (mesh) {
			mesh.removeFromParent();
			entityToObject3D.delete(entity);
		}
	}

	world.onEntityAdded.subscribe(attachEntity);
	world.onEntityRemoved.subscribe(detachEntity);

	for (const entity of world.with("viewId", "position")) {
		if (!entityToObject3D.has(entity)) {
			attachEntity(entity);
		}
	}

	return (_dt: number) => {
		for (const entity of allWithView) {
			const mesh = entityToObject3D.get(entity);
			if (!mesh) continue;

			mesh.position.copy(entity.position as THREE.Vector3);
		}

		for (const entity of enemiesWithView) {
			const mesh = entityToObject3D.get(entity) as THREE.Mesh;
			if (!mesh) continue;

			const materialKey = entity.visualStatus;
			mesh.material =
				SHARED_ENEMY_MATERIALS[
					materialKey as keyof typeof SHARED_ENEMY_MATERIALS
				] || SHARED_ENEMY_MATERIALS.moving;
		}

		const towerEntity = towerWithView.first;
		if (towerEntity) {
			const mesh = entityToObject3D.get(towerEntity) as THREE.Mesh;
			if (mesh) {
				if (towerEntity.towerState === TowerState.BROKEN) {
					mesh.material = SHARED_TOWER_BROKEN_MATERIAL;
				} else {
					const materialKey = towerEntity.visualStatus;
					mesh.material =
						SHARED_TOWER_MATERIALS[
							materialKey as keyof typeof SHARED_TOWER_MATERIALS
						] || SHARED_TOWER_MATERIALS[VisualStatus.IDLE];
				}
			}
		}

		renderer.render(scene, camera);
	};
}
