import { world, EnemyState, TowerState } from "$lib/core/world";
import * as THREE from "three";
import { createGround } from "../factories";
import { createEnemy } from "$lib/modules/enemies/factories";
import { createTower } from "$lib/modules/towers/factories";
import { setScene } from "$lib/modules/economy/factories";

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
	const enemies = world.with("enemy", "x", "y", "z", "mesh", "enemyState");
	const projectiles = world.with("projectile", "x", "y", "z", "mesh");
	const towers = world.with("tower", "x", "y", "z", "mesh", "towerState");

	for (const enemy of enemies) {
		if (enemy.mesh && enemy.x !== undefined && enemy.y !== undefined && enemy.z !== undefined) {
			enemy.mesh.position.set(enemy.x, enemy.y, enemy.z);

			const color = enemy.enemyState === EnemyState.ATTACKING
				? 0xff4444
				: enemy.enemyState === EnemyState.COOLDOWN
					? 0xffff00
					: enemy.enemyState === EnemyState.HAPPY
						? 0x4444ff
						: 0x00ff00;

			(enemy.mesh.material as THREE.MeshStandardMaterial).color.setHex(color);
		}
	}

	for (const projectile of projectiles) {
		if (projectile.mesh && projectile.x !== undefined && projectile.y !== undefined && projectile.z !== undefined) {
			projectile.mesh.position.set(projectile.x, projectile.y, projectile.z);
		}
	}

	for (const tower of towers) {
		if (tower.mesh && tower.x !== undefined && tower.y !== undefined && tower.z !== undefined) {
			tower.mesh.position.set(tower.x, tower.y, tower.z);

			const color = tower.towerState === TowerState.BROKEN
				? 0xff0000
				: 0x4a4a4a;

			(tower.mesh.material as THREE.MeshStandardMaterial).color.setHex(color);
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
	}
};

export const clearGameEntities = () => {
	if (!scene) return;

	const entities = world.with("mesh");
	const toRemove: Array<ReturnType<typeof world.with>[number]> = [];

	for (const entity of entities) {
		toRemove.push(entity);
	}

	for (const entity of toRemove) {
		if (entity.mesh) {
			scene.remove(entity.mesh);
			entity.mesh.geometry.dispose();
			if (Array.isArray(entity.mesh.material)) {
				entity.mesh.material.forEach((m: THREE.Material) => m.dispose());
			} else {
				(entity.mesh.material as THREE.Material).dispose();
			}
		}
	}

	for (const entity of toRemove) {
		world.remove(entity);
	}
};
