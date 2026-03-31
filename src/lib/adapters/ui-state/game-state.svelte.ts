export const GameState = {
	MENU: "menu",
	PLAYING: "playing",
	PAUSED: "paused",
	SETTINGS: "settings",
	GAME_OVER_ANIMATING: "gameOverAnimating", // Анимация поражения (~1 сек)
	GAME_OVER: "gameOver", // Показ меню game over
} as const;

export type GameStateType = (typeof GameState)[keyof typeof GameState];

export interface UiState {
	gameState: GameStateType;
	gold: number;
	wave: number;
	towerHp: number;
	towerMaxHp: number;
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
	towerHp: 0,
	towerMaxHp: 0,
	settings: {
		musicVolume: 50,
		sfxVolume: 50,
		musicEnabled: true,
		sfxEnabled: true,
	},
});
