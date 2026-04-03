import { AppState, setAppState } from "$lib/core/app-state.svelte";
import { initializeGameState, resetGameState } from "$lib/core/game-state";
import { GAME_OVER_ANIMATION_DURATION } from "./constants";
import { GameEngine, GameEvents } from "./event-bus";
import { createGameLoop } from "./game-loop";
import { world } from "./world";

const gameLoop = createGameLoop(world);

export function startGameLoop(canvas: HTMLCanvasElement) {
	if (gameLoop.isRunning()) return;

	initializeGameState();
	gameLoop.start(canvas);
}

export function stopGameLoop() {
	if (!gameLoop.isRunning()) return;

	gameLoop.stop();
}

export const initGameStateMachine = () => {
	let gameOverTimeout: ReturnType<typeof setTimeout> | null = null;

	GameEngine.on(GameEvents.START_GAME, () => {
		if (gameLoop.isRunning()) {
			stopGameLoop();
		}
		if (gameOverTimeout) {
			clearTimeout(gameOverTimeout);
			gameOverTimeout = null;
		}
		resetGameState();
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
		stopGameLoop();
	});

	return () => {
		if (gameOverTimeout) {
			clearTimeout(gameOverTimeout);
		}
	};
};
