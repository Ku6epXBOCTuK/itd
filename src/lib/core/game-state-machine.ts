import { AppState, setAppState } from "$lib/core/app-state.svelte";
import { initializeGameState, resetGameState } from "$lib/core/game-state";
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
	GameEngine.on(GameEvents.START_GAME, () => {
		if (gameLoop.isRunning()) {
			stopGameLoop();
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

	GameEngine.on(GameEvents.GAME_OVER, () => {
		setAppState(AppState.GAME_OVER);
	});

	GameEngine.on(GameEvents.TO_MENU, () => {
		resetGameState();
		setAppState(AppState.MENU);
		stopGameLoop();
	});

	return () => {};
};
