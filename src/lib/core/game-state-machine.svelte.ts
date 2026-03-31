import { GameLoop } from "./game-loop";
import { uiState, GameState } from "$lib/adapters/ui-state/game-state.svelte";
import {
	initRender,
	resizeRenderer,
	disposeRenderer,
} from "$lib/modules/render/systems/sync-render.system";
import { initializeGameState } from "$lib/modules/economy/factories";

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

export const initGameStateMachine = () => {
	const resizeObserver = new ResizeObserver(handleResize);

	$effect(() => {
		if (uiState.gameState === GameState.PLAYING && !isGameRunning) {
			startGame();
		}

		if (
			uiState.gameState === GameState.MENU ||
			uiState.gameState === GameState.SETTINGS ||
			uiState.gameState === GameState.GAME_OVER
		) {
			if (isGameRunning) {
				stopGame();
			}
		}
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
