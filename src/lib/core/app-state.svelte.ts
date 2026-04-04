export const AppState = {
	MENU: "menu",
	SETTINGS: "settings",
	PLAYING: "playing",
	PAUSED: "paused",
	GAME_OVER: "game_over",
} as const;

export type AppStateType = (typeof AppState)[keyof typeof AppState];

export const appState = $state<{ current: AppStateType }>({
	current: AppState.MENU,
});

export const setAppState = (state: AppStateType) => {
	appState.current = state;
};

export const pauseGame = () => {
	appState.current = AppState.PAUSED;
};

export const resumeGame = () => {
	appState.current = AppState.PLAYING;
};

export const isPaused = () => appState.current === AppState.PAUSED;
