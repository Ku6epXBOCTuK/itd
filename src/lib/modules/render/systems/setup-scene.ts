import * as THREE from "three";
import { createGround } from "../factory";
import { RENDER_CONFIG } from "$lib/core/game-config";

export interface RenderSetup {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;
}

export function setupScene(canvas: HTMLCanvasElement): RenderSetup {
	const { width, height } = canvas.getBoundingClientRect();

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(RENDER_CONFIG.colors.background);

	const { fov, near, far, position } = RENDER_CONFIG.camera;
	const camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
	camera.position.set(position.x, position.y, position.z);
	camera.lookAt(0, 0, 0);
	camera.layers.enable(1);

	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
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

	return { scene, camera, renderer };
}
