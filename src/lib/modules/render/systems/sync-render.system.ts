import { world, EnemyState } from "$lib/core/world";
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
	createTower(scene, 0, 0);

	const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
	scene.add(gridHelper);
};

export const SyncRenderSystem = () => {
	const enemies = world.with("enemy", "x", "y", "z", "mesh", "originalColor", "enemyState");
	const projectiles = world.with("projectile", "x", "y", "z", "mesh");

	for (const enemy of enemies) {
		if (enemy.mesh && enemy.x !== undefined && enemy.y !== undefined && enemy.z !== undefined) {
			enemy.mesh.position.set(enemy.x, enemy.y, enemy.z);

			const color = enemy.enemyState === EnemyState.ATTACKING
				? 0xff4444
				: enemy.enemyState === EnemyState.COOLDOWN
					? 0xffff00
					: 0x00ff00;

			(enemy.mesh.material as THREE.MeshStandardMaterial).color.setHex(color);
		}
	}

	for (const projectile of projectiles) {
		if (projectile.mesh && projectile.x !== undefined && projectile.y !== undefined && projectile.z !== undefined) {
			projectile.mesh.position.set(projectile.x, projectile.y, projectile.z);
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
