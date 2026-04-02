export interface DebugState {
	fps: number;
	enemyCount: number;
	projectileCount: number;
}

export const debugState = $state<DebugState>({
	fps: 0,
	enemyCount: 0,
	projectileCount: 0,
});
