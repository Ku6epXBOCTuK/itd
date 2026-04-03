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
	const inScene = world.with("inScene", "position", "view");
	const settingsEntity = Array.from(world.with("settings"))[0];

	const showHpBar = settingsEntity?.settings.showHpBar ?? true;

	if (cameraRef) {
		if (showHpBar) {
			cameraRef.layers.enable(1);
		} else {
			cameraRef.layers.disable(1);
		}
	}

	for (const entity of inScene) {
		if (!entity.view || !entity.position) continue;

		entity.view.mesh.position.set(
			entity.position.x,
			entity.position.y,
			entity.position.z,
		);

		if (entity.enemy) {
			const materialKey = entity.dying
				? EnemyState.DYING
				: entity.enemy.enemyState;
			entity.view.mesh.material = SHARED_ENEMY_MATERIALS[materialKey];

			if (entity.enemy.sprite) {
				const hpPercent = entity.enemy.hp / entity.enemy.maxHp;
				(
					entity.enemy.sprite.material as unknown as THREE.ShaderMaterial
				).uniforms.uHpPercent.value = hpPercent;
				entity.enemy.sprite.position.set(
					entity.position.x,
					entity.position.y + 1.0,
					entity.position.z,
				);
				entity.enemy.sprite.visible = !entity.dying;
			}
		}

		if (entity.tower) {
			entity.view.mesh.material =
				entity.tower.towerState === TowerState.BROKEN
					? SHARED_TOWER_BROKEN_MATERIAL
					: SHARED_TOWER_MATERIAL;
		}
	}
};
