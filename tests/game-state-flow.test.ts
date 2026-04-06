import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	appState,
	AppState,
	setAppState,
} from "../src/lib/core/app-state.svelte";
import { GameEngine, GameEvents } from "../src/lib/core/event-bus";

vi.mock("../src/lib/core/bootstrap", () => ({
	bootstrapGame: vi.fn(() => ({
		start: vi.fn(),
		stop: vi.fn(),
		isRunning: () => false,
	})),
}));

describe("AppState Flow", () => {
	beforeEach(() => {
		setAppState(AppState.MENU);
	});

	describe("GameEngine события", () => {
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

		it("должен переключать в GAME_OVER при GAME_OVER событии", () => {
			setAppState(AppState.PLAYING);
			GameEngine.emit(GameEvents.GAME_OVER);
			expect(appState.current).toBe(AppState.GAME_OVER);
		});

		it("должен переключать в MENU при TO_MENU", () => {
			setAppState(AppState.PLAYING);
			GameEngine.emit(GameEvents.TO_MENU);
			expect(appState.current).toBe(AppState.MENU);
		});
	});
});
