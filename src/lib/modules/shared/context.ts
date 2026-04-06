import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { GameEngine } from "$lib/core/event-bus";
import type * as THREE from "three";

export type BaseContext = {
	world: World<Entity>;
	eventBus: typeof GameEngine;
};

export type RenderContext = BaseContext & {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;
};
