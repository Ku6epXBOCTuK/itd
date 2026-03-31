import { hudState } from "$lib/adapters/ui-state/hud-state.svelte";
import {
	initializeGameState,
	resetGameState,
} from "$lib/modules/economy/factories";
import {
	disposeRenderer,
	initRender,
	resizeRenderer,
	SyncRenderSystem,
} from "$lib/modules/render/systems/sync-render.system";
import { UpdateHudSystem } from "$lib/modules/hud/systems/update-hud.system";
import { GameEngine, GameEvents } from "./event-bus";
import { GameLoop } from "./game-loop";
import { setAppState, AppState } from "$lib/core/app-state.svelte";

let canvas: HTMLCanvasElement | null = null;
let isGameRunning = false;

function startGame() {
	if (isGameRunning || !canvas) return;

	const { width, height } = canvas.getBoundingClientRect();
	initRender(canvas, width, height);
	initializeGameState();

	// Форсируем первый рендер и обновление HUD
	SyncRenderSystem();
	UpdateHudSystem();

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
		}, 3000);
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
