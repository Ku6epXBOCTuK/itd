import type { BaseContext } from "$lib/modules/shared/context";
import { GameEngine, GameEvents } from "$lib/core/event-bus";

export function createGameOverTimerSystem(ctx: BaseContext) {
	const world = ctx.world;
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
