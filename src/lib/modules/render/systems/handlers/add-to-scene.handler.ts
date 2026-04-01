import { world, type Entity } from "$lib/core/world";
import * as THREE from "three";

let sceneRef: THREE.Scene | null = null;

export const setSceneRef = (scene: THREE.Scene) => {
	sceneRef = scene;
};

export const addToScene = () => {
	if (!sceneRef) return;

	const pendingScene = world.with("view").without("inScene");
	for (const entity of pendingScene) {
		if (entity.view) {
			sceneRef.add(entity.view.mesh);
		}
		if (entity.enemy?.sprite) {
			sceneRef.add(entity.enemy.sprite);
		}
		world.addComponent(entity, "inScene", { inScene: true });
	}
};

export const removeFromScene = (entity: Entity) => {
	if (!sceneRef) return;

	if (entity.view) {
		sceneRef.remove(entity.view.mesh);
	}
	if (entity.enemy?.sprite) {
		sceneRef.remove(entity.enemy.sprite);
	}
};
