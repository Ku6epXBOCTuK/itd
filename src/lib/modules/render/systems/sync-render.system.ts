import { world } from "$lib/core/world";
import * as THREE from "three";
import { createGround } from "../factories";
import { createEnemy } from "$lib/modules/enemies/factories";
import { createTower } from "$lib/modules/towers/factories";

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
	createEnemy(scene, "basic", 5, 5);

	const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
	scene.add(gridHelper);
};

export const SyncRenderSystem = () => {
	const enemies = world.with("position", "view");

	for (const enemy of enemies) {
		enemy.view.mesh.position.copy(enemy.position);
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
