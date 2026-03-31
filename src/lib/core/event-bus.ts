import type { EnemyTypeValue } from "$lib/modules/enemies/enemies.components";

export const GameEvents = {
	SPAWN_ENEMY: Symbol("spawn-enemy"),
	START_GAME: Symbol("start-game"),
	PAUSE_GAME: Symbol("pause-game"),
	RESUME_GAME: Symbol("resume-game"),
	STOP_GAME: Symbol("stop-game"),
	TO_MENU: Symbol("to-menu"),
} as const;

export type GameEventType = (typeof GameEvents)[keyof typeof GameEvents];

type EventDataMap = {
	[GameEvents.SPAWN_ENEMY]: { type: EnemyTypeValue; x: number; z: number };
	[GameEvents.START_GAME]: undefined;
	[GameEvents.PAUSE_GAME]: undefined;
	[GameEvents.RESUME_GAME]: undefined;
	[GameEvents.STOP_GAME]: undefined;
	[GameEvents.TO_MENU]: undefined;
};

type EventCallback<T extends GameEventType> = (data: EventDataMap[T]) => void;

const listeners = new Map<GameEventType, Set<EventCallback<any>>>();

export const GameEngine = {
	emit<T extends GameEventType>(event: T, data?: EventDataMap[T]) {
		const eventListeners = listeners.get(event);
		if (eventListeners) {
			for (const callback of eventListeners) {
				callback(data);
			}
		}
	},

	on<T extends GameEventType>(event: T, callback: EventCallback<T>) {
		if (!listeners.has(event)) {
			listeners.set(event, new Set());
		}
		listeners.get(event)!.add(callback);
	},

	off<T extends GameEventType>(event: T, callback: EventCallback<T>) {
		const eventListeners = listeners.get(event);
		if (eventListeners) {
			eventListeners.delete(callback);
		}
	},
};
