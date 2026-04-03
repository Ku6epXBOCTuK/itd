import { world, type Entity } from "$lib/core/world";
import * as THREE from "three";
import { createGround } from "../factory";
import { RENDER_CONFIG } from "$lib/core/game-config";
import { ViewBridge } from "./view-bridge";
import { setCameraRef, syncTransform } from "./handlers/sync-transform.handler";

let canvas: HTMLCanvasElement | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;

export const setCanvas = (c: HTMLCanvasElement) => {
	canvas = c;
};

export const createSyncRenderSystem = () => {
	const resizeObserver = new ResizeObserver((_entries) => {
		if (!canvas) return;
		const { width, height } = canvas.getBoundingClientRect();
		if (renderer && camera) {
			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		}
	});

	const initRender = () => {
		if (!canvas) return;

		const { width, height } = canvas.getBoundingClientRect();

		scene = new THREE.Scene();
		scene.background = new THREE.Color(RENDER_CONFIG.colors.background);

		const { fov, near, far, position } = RENDER_CONFIG.camera;
		camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
		camera.position.set(position.x, position.y, position.z);
		camera.lookAt(0, 0, 0);
		camera.layers.enable(1);
		setCameraRef(camera);

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

		resizeObserver.observe(canvas);

		world.onEntityRemoved.subscribe((entity: Entity) => {
			ViewBridge.detach(entity);
		});
	};

	initRender();

	return (_dt: number) => {
		if (!scene) return;
		syncTransform();

		const pendingEnemies = world.with("isEnemy", "position");
		for (const entity of pendingEnemies) {
			if (!ViewBridge.getObject3D(entity)) {
				ViewBridge.initEntity(entity, scene!);
			}
		}

		const pendingProjectiles = world.with("isProjectile", "position");
		for (const entity of pendingProjectiles) {
			if (!ViewBridge.getObject3D(entity)) {
				ViewBridge.initEntity(entity, scene!);
			}
		}

		const pendingTowers = world.with("isTower", "position");
		for (const entity of pendingTowers) {
			if (!ViewBridge.getObject3D(entity)) {
				ViewBridge.initEntity(entity, scene!);
			}
		}

		const inScene = world.with("viewId", "position");
		for (const entity of inScene) {
			ViewBridge.syncEntity(entity);
		}

		if (renderer && scene && camera) {
			renderer.render(scene, camera);
		}
	};
};
