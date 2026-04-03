import { AppState, setAppState } from "$lib/core/app-state.svelte";
import { initializeGameState, resetGameState } from "$lib/core/game-state";
import { GAME_OVER_ANIMATION_DURATION } from "./constants";
import { GameEngine, GameEvents } from "./event-bus";
import { GameLoop } from "./game-loop";

let isGameRunning = false;

function startGame() {
	if (isGameRunning) return;

	initializeGameState();
	GameLoop.start();
	isGameRunning = true;
}

function stopGame() {
	if (!isGameRunning) return;

	GameLoop.stop();
	isGameRunning = false;
}

export const initGameStateMachine = () => {
	let gameOverTimeout: ReturnType<typeof setTimeout> | null = null;

	GameEngine.on(GameEvents.START_GAME, () => {
		if (isGameRunning) {
			stopGame();
		}
		if (gameOverTimeout) {
			clearTimeout(gameOverTimeout);
			gameOverTimeout = null;
		}
		resetGameState();
		startGame();
		setAppState(AppState.PLAYING);
	});

	GameEngine.on(GameEvents.PAUSE_GAME, () => {
		setAppState(AppState.PAUSED);
	});

	GameEngine.on(GameEvents.RESUME_GAME, () => {
		setAppState(AppState.PLAYING);
	});

	GameEngine.on(GameEvents.STOP_GAME, () => {
		setAppState(AppState.GAME_OVER_ANIMATING);

		if (gameOverTimeout) {
			clearTimeout(gameOverTimeout);
		}
		gameOverTimeout = setTimeout(() => {
			setAppState(AppState.GAME_OVER);
			gameOverTimeout = null;
		}, GAME_OVER_ANIMATION_DURATION);
	});

	GameEngine.on(GameEvents.TO_MENU, () => {
		if (gameOverTimeout) {
			clearTimeout(gameOverTimeout);
			gameOverTimeout = null;
		}
		resetGameState();
		setAppState(AppState.MENU);
		stopGame();
	});

	return () => {
		if (gameOverTimeout) {
			clearTimeout(gameOverTimeout);
		}
	};
};
