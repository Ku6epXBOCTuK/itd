type EventMap = {
	"spawn-enemy": (data: { type: string; x: number; z: number }) => void;
	"start-game": () => void;
	"pause-game": () => void;
	"resume-game": () => void;
	"stop-game": () => void;
	"to-menu": () => void;
};

type EventCallback<T extends keyof EventMap> = EventMap[T];

const listeners = new Map<keyof EventMap, Set<EventCallback<any>>>();

export const GameEngine = {
	emit<T extends keyof EventMap>(event: T, data?: Parameters<EventMap[T]>[0]) {
		const eventListeners = listeners.get(event);
		if (eventListeners) {
			for (const callback of eventListeners) {
				callback(data);
			}
		}
	},

	on<T extends keyof EventMap>(event: T, callback: EventCallback<T>) {
		if (!listeners.has(event)) {
			listeners.set(event, new Set());
		}
		listeners.get(event)!.add(callback);
	},

	off<T extends keyof EventMap>(event: T, callback: EventCallback<T>) {
		const eventListeners = listeners.get(event);
		if (eventListeners) {
			eventListeners.delete(callback);
		}
	},
};
