import { describe, it, expect, vi } from "vitest";
import { GameEngine, GameEvents } from "$lib/core/event-bus";

describe("GameEngine", () => {
	describe("on + emit", () => {
		it("должен вызывать подписчика при событии", () => {
			const callback = vi.fn();
			GameEngine.on(GameEvents.PAUSE_GAME, callback);

			GameEngine.emit(GameEvents.PAUSE_GAME);

			expect(callback).toHaveBeenCalledTimes(1);
		});

		it("должен передавать данные в подписчика", () => {
			const callback = vi.fn();
			GameEngine.on(GameEvents.SPAWN_ENEMY, callback);

			GameEngine.emit(GameEvents.SPAWN_ENEMY, {
				type: "basic",
				x: 5,
				z: 5,
			});

			expect(callback).toHaveBeenCalledWith({
				type: "basic",
				x: 5,
				z: 5,
			});
		});

		it("должен вызывать нескольких подписчиков", () => {
			const callback1 = vi.fn();
			const callback2 = vi.fn();
			GameEngine.on(GameEvents.RESUME_GAME, callback1);
			GameEngine.on(GameEvents.RESUME_GAME, callback2);

			GameEngine.emit(GameEvents.RESUME_GAME);

			expect(callback1).toHaveBeenCalledTimes(1);
			expect(callback2).toHaveBeenCalledTimes(1);
		});
	});

	describe("off", () => {
		it("должен отписывать подписчика", () => {
			const callback = vi.fn();
			GameEngine.on(GameEvents.TO_MENU, callback);
			GameEngine.off(GameEvents.TO_MENU, callback);

			GameEngine.emit(GameEvents.TO_MENU);

			expect(callback).not.toHaveBeenCalled();
		});

		it("должен отписывать только указанного подписчика", () => {
			const callback1 = vi.fn();
			const callback2 = vi.fn();
			GameEngine.on(GameEvents.START_GAME, callback1);
			GameEngine.on(GameEvents.START_GAME, callback2);
			GameEngine.off(GameEvents.START_GAME, callback1);

			GameEngine.emit(GameEvents.START_GAME);

			expect(callback1).not.toHaveBeenCalled();
			expect(callback2).toHaveBeenCalledTimes(1);
		});
	});

	describe("события без данных", () => {
		it("должен работать с событиями без данных", () => {
			const callback = vi.fn();
			GameEngine.on(GameEvents.PAUSE_GAME, callback);

			GameEngine.emit(GameEvents.PAUSE_GAME);

			expect(callback).toHaveBeenCalledWith(undefined);
		});
	});
});
