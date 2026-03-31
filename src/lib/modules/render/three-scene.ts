import * as THREE from "three";
import { world } from "$lib/core/world";

export interface Scene3D {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;
}

export const createScene3D = (canvas: HTMLCanvasElement): Scene3D => {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x1a1a2e);

	const camera = new THREE.PerspectiveCamera(
		75,
		canvas.clientWidth / canvas.clientHeight,
		0.1,
		1000,
	);
	camera.position.set(0, 10, 10);
	camera.lookAt(0, 0, 0);

	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
	renderer.setSize(canvas.clientWidth, canvas.clientHeight);

	const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
	directionalLight.position.set(10, 10, 5);
	scene.add(directionalLight);

	const groundGeometry = new THREE.PlaneGeometry(20, 20);
	const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
	const ground = new THREE.Mesh(groundGeometry, groundMaterial);
	ground.rotation.x = -Math.PI / 2;
	ground.receiveShadow = true;
	scene.add(ground);

	const towerGeometry = new THREE.BoxGeometry(1, 2, 1);
	const towerMaterial = new THREE.MeshStandardMaterial({ color: 0x4a4a4a });
	const tower = new THREE.Mesh(towerGeometry, towerMaterial);
	tower.position.set(0, 1, 0);
	tower.castShadow = true;
	scene.add(tower);

	world.add({
		position: { x: 0, y: 1, z: 0 },
		view: { mesh: tower },
	});

	const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
	scene.add(gridHelper);

	return { scene, camera, renderer };
};
