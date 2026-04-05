import { FPS_HISTORY_SIZE } from "$lib/core/constants";

export interface DebugState {
	fps: number;
	fpsHistory: number[];
	enemyCount: number;
	projectileCount: number;
	towerDamage: number;
}

export const debugState = $state<DebugState>({
	fps: 0,
	fpsHistory: new Array(FPS_HISTORY_SIZE).fill(0),
	enemyCount: 0,
	projectileCount: 0,
	towerDamage: 0,
});
