import { world, EnemyState, TowerState } from "$lib/core/world";
import * as THREE from "three";
import { createGround } from "../factories";
import { setScene } from "$lib/core/game-state";
import {
	ENEMY_COLORS,
	RENDER_CONFIG,
	TOWER_COLORS,
} from "$lib/core/game-config";

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;

export const initRender = (
	canvas: HTMLCanvasElement,
	width: number,
	height: number,
) => {
	if (!scene) {
		scene = new THREE.Scene();
		scene.background = new THREE.Color(RENDER_CONFIG.colors.background);
		setScene(scene);

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

			const color = ENEMY_COLORS[enemy.enemy.enemyState];

			(enemy.view.mesh.material as THREE.MeshStandardMaterial).color.setHex(
				color,
			);
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

			const color =
				tower.tower.towerState === TowerState.BROKEN
					? TOWER_COLORS[TowerState.BROKEN]
					: TOWER_COLORS[TowerState.IDLE];

			(tower.view.mesh.material as THREE.MeshStandardMaterial).color.setHex(
				color,
			);
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
	if (!scene) return;

	const entities = world.with("view", "enemy");
	const toRemove: Array<ReturnType<typeof world.with>[number]> = [];

	for (const entity of entities) {
		toRemove.push(entity);
	}

	for (const entity of toRemove) {
		if (entity.view) {
			scene.remove(entity.view.mesh);
			entity.view.mesh.geometry.dispose();
			if (Array.isArray(entity.view.mesh.material)) {
				entity.view.mesh.material.forEach((m: THREE.Material) => m.dispose());
			} else {
				(entity.view.mesh.material as THREE.Material).dispose();
			}
		}
		if (entity.enemy?.sprite) {
			scene.remove(entity.enemy.sprite);
		}
		world.remove(entity);
	}
};
