import { GameLoop } from "./game-loop";
import { uiState, GameState, type GameStateType } from "$lib/adapters/ui-state/game-state.svelte";
import {
	initRender,
	resizeRenderer,
	disposeRenderer,
} from "$lib/modules/render/systems/sync-render.system";
import { initializeGameState, resetGameState } from "$lib/modules/economy/factories";
import { GameEngine, GameEvents } from "./event-bus";
import { resumeGame } from "./world";

let canvas: HTMLCanvasElement | null = null;
let isGameRunning = false;

function startGame() {
	if (isGameRunning || !canvas) return;

	const { width, height } = canvas.getBoundingClientRect();
	initRender(canvas, width, height);
	initializeGameState();
	GameLoop.start();
	isGameRunning = true;
}

function stopGame() {
	if (!isGameRunning) return;

	GameLoop.stop();
	disposeRenderer();
	isGameRunning = false;
}

function handleResize() {
	if (!canvas) return;
	const { width, height } = canvas.getBoundingClientRect();
	resizeRenderer(width, height);
}

export const setGameCanvas = (newCanvas: HTMLCanvasElement) => {
	canvas = newCanvas;
};

const setGameState = (state: GameStateType) => {
	uiState.gameState = state;
};

export const initGameStateMachine = () => {
	const resizeObserver = new ResizeObserver(handleResize);

	GameEngine.on(GameEvents.START_GAME, () => {
		resetGameState();
		startGame();
		setGameState(GameState.PLAYING);
	});

	GameEngine.on(GameEvents.PAUSE_GAME, () => {
		setGameState(GameState.PAUSED);
	});

	GameEngine.on(GameEvents.RESUME_GAME, () => {
		resumeGame();
		setGameState(GameState.PLAYING);
	});

	GameEngine.on(GameEvents.STOP_GAME, () => {
		setGameState(GameState.GAME_OVER);
		stopGame();
	});

	GameEngine.on(GameEvents.TO_MENU, () => {
		resetGameState();
		resumeGame();
		setGameState(GameState.MENU);
		stopGame();
	});

	$effect(() => {
		if (canvas) {
			resizeObserver.observe(canvas);
			return () => {
				if (canvas) {
					resizeObserver.unobserve(canvas);
				}
			};
		}
	});
};
