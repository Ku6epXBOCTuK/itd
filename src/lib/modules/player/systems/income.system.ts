import type { BaseContext } from "$lib/modules/shared/context";
import { SECOND_MS } from "$lib/core/constants";

export function createIncomeSystem(ctx: BaseContext) {
	const players = ctx.world.with("gold", "incomePerSecond");

	return (dt: number) => {
		for (const player of players) {
			player.gold += (player.incomePerSecond * dt) / SECOND_MS;
		}
	};
}
