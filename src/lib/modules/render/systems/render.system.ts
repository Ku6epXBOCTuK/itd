import type { World } from "miniplex";
import * as THREE from "three";
import type { Entity } from "$lib/core/world";
import type { ViewIdType } from "$lib/modules/render/components";
import {
	SHARED_GEOMETRIES,
	SHARED_ENEMY_MATERIALS,
	SHARED_TOWER_MATERIAL,
	SHARED_TOWER_BROKEN_MATERIAL,
	SHARED_PROJECTILE_MATERIAL,
} from "$lib/core/game-config";
import { TowerState } from "$lib/core/world";
import { VisualStatus, ViewId } from "$lib/modules/render/components";
import { setupScene } from "./setup-scene";

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

function createResizeObserver(
	canvas: HTMLCanvasElement,
	renderer: THREE.WebGLRenderer,
	camera: THREE.PerspectiveCamera,
) {
	return new ResizeObserver((_entries) => {
		const { width, height } = canvas.getBoundingClientRect();
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	});
}

export function createSyncRenderSystem(
	world: World<Entity>,
	canvas: HTMLCanvasElement,
) {
	const entityToObject3D = new WeakMap<Entity, THREE.Object3D>();

	const allWithView = world.with("viewId", "position");
	const enemiesWithView = world.with("enemyTag", "viewId", "position");
	const towerWithView = world.with("towerTag", "viewId", "position").first;

	const setup = setupScene(canvas);
	const scene = setup.scene;
	const camera = setup.camera;
	const renderer = setup.renderer;
	createResizeObserver(canvas, renderer, camera).observe(canvas);

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

			const materialKey = entity.visualStatus ?? VisualStatus.MOVING;
			mesh.material =
				SHARED_ENEMY_MATERIALS[
					materialKey as keyof typeof SHARED_ENEMY_MATERIALS
				] || SHARED_ENEMY_MATERIALS.moving;
		}

		const towerEntity = towerWithView;
		if (towerEntity) {
			const mesh = entityToObject3D.get(towerEntity) as THREE.Mesh;
			if (mesh) {
				mesh.material =
					towerEntity.towerState === TowerState.BROKEN
						? SHARED_TOWER_BROKEN_MATERIAL
						: SHARED_TOWER_MATERIAL;
			}
		}

		renderer.render(scene, camera);
	};
}
