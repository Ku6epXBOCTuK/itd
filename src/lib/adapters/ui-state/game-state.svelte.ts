export const GameState = {
	MENU: "menu",
	PLAYING: "playing",
	SETTINGS: "settings",
	GAME_OVER: "gameOver",
} as const;

export type GameStateType = (typeof GameState)[keyof typeof GameState];

export interface UiState {
	gameState: GameStateType;
	gold: number;
	wave: number;
	isPaused: boolean;
	towerHp: number;
	towerMaxHp: number;
	gameOver: boolean;
	settings: {
		musicVolume: number;
		sfxVolume: number;
		musicEnabled: boolean;
		sfxEnabled: boolean;
	};
}

export const uiState = $state<UiState>({
	gameState: GameState.MENU,
	gold: 0,
	wave: 0,
	isPaused: false,
	towerHp: 0,
	towerMaxHp: 0,
	gameOver: false,
	settings: {
		musicVolume: 50,
		sfxVolume: 50,
		musicEnabled: true,
		sfxEnabled: true,
	},
});
