import { world, EnemyState, TowerState } from "$lib/core/world";
import * as THREE from "three";
import {
	SHARED_ENEMY_MATERIALS,
	SHARED_TOWER_MATERIAL,
	SHARED_TOWER_BROKEN_MATERIAL,
} from "$lib/core/game-config";

let cameraRef: THREE.PerspectiveCamera | null = null;

export const setCameraRef = (camera: THREE.PerspectiveCamera) => {
	cameraRef = camera;
};

export const syncTransform = () => {
	const settingsEntity = Array.from(world.with("settings"))[0];
	const showHpBar = settingsEntity?.settings.showHpBar ?? true;

	if (cameraRef) {
		if (showHpBar) {
			cameraRef.layers.enable(1);
		} else {
			cameraRef.layers.disable(1);
		}
	}
};
