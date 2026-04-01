import { world, EnemyState, TowerState, type Entity } from "$lib/core/world";
import * as THREE from "three";
import { createGround } from "../factories";
import {
	RENDER_CONFIG,
	SHARED_ENEMY_MATERIALS,
	SHARED_TOWER_MATERIAL,
	SHARED_TOWER_BROKEN_MATERIAL,
} from "$lib/core/game-config";

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;

const cleanupEntityResources = (entity: Entity) => {
	if (entity.view) {
		entity.view.mesh.removeFromParent();
	}
	if (entity.enemy?.sprite) {
		entity.enemy.sprite.removeFromParent();
		entity.enemy.sprite.material.dispose();
	}
};

world.onEntityRemoved.subscribe(cleanupEntityResources);

export const initRender = (
	canvas: HTMLCanvasElement,
	width: number,
	height: number,
) => {
	if (!scene) {
		scene = new THREE.Scene();
		scene.background = new THREE.Color(RENDER_CONFIG.colors.background);

		const { fov, near, far, position } = RENDER_CONFIG.camera;
		camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
		camera.position.set(position.x, position.y, position.z);
		camera.lookAt(0, 0, 0);
		camera.layers.enable(1);

		renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		renderer.setSize(width, height);

		const ambientLight = new THREE.AmbientLight(
			RENDER_CONFIG.colors.ambient,
			RENDER_CONFIG.light.ambientIntensity,
		);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(
			RENDER_CONFIG.colors.directional,
			RENDER_CONFIG.light.directionalIntensity,
		);
		const { x, y, z } = RENDER_CONFIG.light.directionalPosition;
		directionalLight.position.set(x, y, z);
		scene.add(directionalLight);

		createGround(scene);

		const grid = RENDER_CONFIG.grid;
		const gridHelper = new THREE.GridHelper(
			grid.size,
			grid.divisions,
			grid.colorCenterLine,
			grid.colorGrid,
		);
		scene.add(gridHelper);
	}

	if (renderer && camera) {
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}
};

export const SyncRenderSystem = () => {
	const pendingScene = world.with("view").without("inScene");
	for (const entity of pendingScene) {
		if (scene) {
			if (entity.view) {
				scene.add(entity.view.mesh);
			}
			if (entity.enemy?.sprite) {
				scene.add(entity.enemy.sprite);
			}
		}
		world.addComponent(entity, "inScene", { inScene: true });
	}

	const enemies = world.with("enemy", "position", "view");
	const projectiles = world.with("projectile", "position", "view");
	const towers = world.with("tower", "position", "view");
	const settingsEntity = Array.from(world.with("settings"))[0];

	const showHpBar = settingsEntity?.settings.showHpBar ?? true;

	if (camera) {
		if (showHpBar) {
			camera.layers.enable(1);
		} else {
			camera.layers.disable(1);
		}
	}

	for (const enemy of enemies) {
		if (enemy.view && enemy.position) {
			enemy.view.mesh.position.set(
				enemy.position.x,
				enemy.position.y,
				enemy.position.z,
			);

			enemy.view.mesh.material = SHARED_ENEMY_MATERIALS[enemy.enemy.enemyState];
		}

		if (enemy.enemy.sprite) {
			const hpPercent = enemy.enemy.hp / enemy.enemy.maxHp;
			(
				enemy.enemy.sprite.material as unknown as THREE.ShaderMaterial
			).uniforms.uHpPercent.value = hpPercent;
			enemy.enemy.sprite.position.set(
				enemy.position!.x,
				enemy.position!.y + 1.0,
				enemy.position!.z,
			);
			enemy.enemy.sprite.visible = enemy.enemy.enemyState !== EnemyState.DYING;
		}
	}

	for (const projectile of projectiles) {
		if (projectile.view && projectile.position) {
			projectile.view.mesh.position.set(
				projectile.position.x,
				projectile.position.y,
				projectile.position.z,
			);
		}
	}

	for (const tower of towers) {
		if (tower.view && tower.position) {
			tower.view.mesh.position.set(
				tower.position.x,
				tower.position.y,
				tower.position.z,
			);

			tower.view.mesh.material =
				tower.tower.towerState === TowerState.BROKEN
					? SHARED_TOWER_BROKEN_MATERIAL
					: SHARED_TOWER_MATERIAL;
		}
	}

	if (renderer && scene && camera) {
		renderer.render(scene, camera);
	}
};

export const resizeRenderer = (width: number, height: number) => {
	if (!renderer || !camera) return;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
};

export const disposeRenderer = () => {
	if (renderer) {
		renderer.dispose();
		renderer = null;
		scene = null;
		camera = null;
	}
};

export const clearGameEntities = () => {
	const entities = world.with("view");
	for (const entity of entities) {
		if (entity.inScene && scene) {
			world.removeComponent(entity, "inScene");
			if (entity.view) {
				scene.remove(entity.view.mesh);
			}
			if (entity.enemy?.sprite) {
				scene.remove(entity.enemy.sprite);
			}
		}
		world.remove(entity);
	}
};
