import { AppState, setAppState } from "$lib/core/app-state.svelte";
import { GameEngine, GameEvents } from "./event-bus";
import { bootstrapGame } from "./bootstrap";

let gameLoop: ReturnType<typeof bootstrapGame> | null = null;

export function startGameLoop(canvas: HTMLCanvasElement) {
	if (gameLoop?.isRunning()) return;

	gameLoop = bootstrapGame(canvas);
	gameLoop.start();
}

export function stopGameLoop() {
	gameLoop?.stop();
}

export const initGameStateMachine = () => {
	GameEngine.on(GameEvents.START_GAME, () => {
		if (gameLoop?.isRunning()) {
			stopGameLoop();
		}
		gameLoop?.reset();
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
		setAppState(AppState.MENU);
		stopGameLoop();
	});

	return () => {};
};
