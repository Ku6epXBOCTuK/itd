import { world, EnemyState, TowerState } from "$lib/core/world";
import * as THREE from "three";
import { createGround } from "../factories";
import { createEnemy } from "$lib/modules/enemies/factories";
import { createTower } from "$lib/modules/towers/factories";
import { setScene } from "$lib/core/game-state";

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
		scene.background = new THREE.Color(0x1a1a2e);
		setScene(scene);

		camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		camera.position.set(0, 10, 10);
		camera.lookAt(0, 0, 0);

		renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		renderer.setSize(width, height);

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(10, 10, 5);
		scene.add(directionalLight);

		createGround(scene);

		const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
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

	for (const enemy of enemies) {
		if (enemy.view && enemy.position) {
			enemy.view.mesh.position.set(enemy.position.x, enemy.position.y, enemy.position.z);

			const color = enemy.enemy.enemyState === EnemyState.ATTACKING
				? 0xff4444
				: enemy.enemy.enemyState === EnemyState.COOLDOWN
					? 0xffff00
					: enemy.enemy.enemyState === EnemyState.HAPPY
						? 0x4444ff
						: enemy.enemy.enemyState === EnemyState.DYING
							? 0xff69b4
							: 0x00ff00;

			(enemy.view.mesh.material as THREE.MeshStandardMaterial).color.setHex(color);
		}
	}

	for (const projectile of projectiles) {
		if (projectile.view && projectile.position) {
			projectile.view.mesh.position.set(projectile.position.x, projectile.position.y, projectile.position.z);
		}
	}

	for (const tower of towers) {
		if (tower.view && tower.position) {
			tower.view.mesh.position.set(tower.position.x, tower.position.y, tower.position.z);

			const color = tower.tower.towerState === TowerState.BROKEN
				? 0xff0000
				: 0x4a4a4a;

			(tower.view.mesh.material as THREE.MeshStandardMaterial).color.setHex(color);
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

	const entities = world.with("view");
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
		world.remove(entity);
	}
};
