import {
	SHARED_ENEMY_MATERIALS,
	SHARED_GEOMETRIES,
	SHARED_PROJECTILE_MATERIAL,
	SHARED_TOWER_BROKEN_MATERIAL,
	SHARED_TOWER_MATERIALS,
} from "$lib/core/game-config";
import type { Entity } from "$lib/core/world";
import { TowerState } from "$lib/core/world";
import { EnemyState } from "$lib/modules/enemies/components";
import type { ViewIdType } from "$lib/modules/render/components";
import { ViewId, VisualStatus } from "$lib/modules/render/components";
import type { RenderContext } from "$lib/modules/shared/context";
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
		"enemyState",
	);
	const towerWithView = world.with(
		"towerTag",
		"viewId",
		"position",
		"visualStatus",
	);

	const BASE_SCALE = 1;
	const ATTACK_SCALE = 1.1;
	const DYING_SCALE = 0;
	const SCALE_LERP = 0.2;

	function lerp(a: number, b: number, t: number): number {
		return a + (b - a) * t;
	}

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

			if (entity.enemyState === EnemyState.DYING) {
				mesh.scale.setScalar(lerp(mesh.scale.x, DYING_SCALE, SCALE_LERP));
			} else if (entity.enemyState === EnemyState.ATTACKING) {
				mesh.scale.setScalar(lerp(mesh.scale.x, ATTACK_SCALE, SCALE_LERP));
			} else {
				mesh.scale.setScalar(lerp(mesh.scale.x, BASE_SCALE, SCALE_LERP));
			}

			if (entity.position && entity.target) {
				const targetPos = entity.target.position;
				const dx = targetPos.x - entity.position.x;
				const dz = targetPos.z - entity.position.z;
				const targetRotation = Math.atan2(dx, dz);
				mesh.rotation.y = lerp(mesh.rotation.y, targetRotation, 0.1);
			}
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
