import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	appState,
	AppState,
	setAppState,
} from "../src/lib/core/app-state.svelte";
import { GameEngine, GameEvents } from "../src/lib/core/event-bus";
import { initGameStateMachine } from "../src/lib/core/game-state-machine.svelte";

const WAIT_MS = 10000;

class MockResizeObserver {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
	constructor() {}
}
global.ResizeObserver = MockResizeObserver;

describe("AppState Flow", () => {
	let cleanup: (() => void) | undefined;

	beforeEach(() => {
		setAppState(AppState.MENU);
	});

	afterEach(() => {
		cleanup?.();
		cleanup = undefined;
	});

	describe("GameEngine события", () => {
		beforeEach(() => {
			cleanup = initGameStateMachine();
		});

		it("должен переключать в PLAYING при START_GAME", () => {
			setAppState(AppState.MENU);
			GameEngine.emit(GameEvents.START_GAME);
			expect(appState.current).toBe(AppState.PLAYING);
		});

		it("должен переключать в PAUSED при PAUSE_GAME", () => {
			setAppState(AppState.PLAYING);
			GameEngine.emit(GameEvents.PAUSE_GAME);
			expect(appState.current).toBe(AppState.PAUSED);
		});

		it("должен переключать в PLAYING при RESUME_GAME", () => {
			setAppState(AppState.PAUSED);
			GameEngine.emit(GameEvents.RESUME_GAME);
			expect(appState.current).toBe(AppState.PLAYING);
		});

		it("должен переключать в GAME_OVER_ANIMATING при STOP_GAME", () => {
			setAppState(AppState.PLAYING);
			GameEngine.emit(GameEvents.STOP_GAME);
			expect(appState.current).toBe(AppState.GAME_OVER_ANIMATING);
		});

		it("должен переключать в GAME_OVER через 3 секунды", async () => {
			vi.useFakeTimers();
			setAppState(AppState.PLAYING);

			GameEngine.emit(GameEvents.STOP_GAME);
			expect(appState.current).toBe(AppState.GAME_OVER_ANIMATING);

			await vi.advanceTimersByTimeAsync(WAIT_MS);
			expect(appState.current).toBe(AppState.GAME_OVER);

			vi.useRealTimers();
		});

		it("должен переключать в MENU при TO_MENU", () => {
			setAppState(AppState.PLAYING);
			GameEngine.emit(GameEvents.TO_MENU);
			expect(appState.current).toBe(AppState.MENU);
		});

		it("должен отменять таймер GAME_OVER при TO_MENU", async () => {
			vi.useFakeTimers();
			setAppState(AppState.PLAYING);

			GameEngine.emit(GameEvents.STOP_GAME);
			expect(appState.current).toBe(AppState.GAME_OVER_ANIMATING);

			GameEngine.emit(GameEvents.TO_MENU);
			expect(appState.current).toBe(AppState.MENU);

			await vi.advanceTimersByTimeAsync(WAIT_MS);
			expect(appState.current).toBe(AppState.MENU);

			vi.useRealTimers();
		});
	});
});
