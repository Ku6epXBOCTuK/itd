import type { World } from "miniplex";
import type { Entity } from "$lib/core/world";
import { GameEngine, GameEvents } from "$lib/core/event-bus";

export function createGameOverTimerSystem(world: World<Entity>) {
	const query = world.with("gameOverTimer");

	return (dt: number) => {
		const entity = query.first;
		if (!entity) return;

		entity.gameOverTimer!.remainingTime -= dt;

		if (entity.gameOverTimer!.remainingTime <= 0) {
			world.removeComponent(entity, "gameOverTimer");
			GameEngine.emit(GameEvents.GAME_OVER);
		}
	};
}
