import { world } from "$lib/core/world";

export const SyncRenderSystem = (deltaTime: number) => {
	const entities = world.with("position", "view");

	for (const entity of entities) {
		entity.view.mesh.position.copy(entity.position);
	}
};
