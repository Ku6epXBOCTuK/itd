import { World } from "miniplex";
import type { View } from "$lib/modules/render/render.components";
import type { Tower } from "$lib/modules/towers/towers.components";
import type { Enemy } from "$lib/modules/enemies/enemies.components";

export const AppState = {
	IN_GAME: "in_game",
	PAUSED: "paused",
} as const;

export type AppStateType = (typeof AppState)[keyof typeof AppState];

type Player = { gold: number; incomePerSecond: number };
type Position = { x: number; y: number; z: number };

export const world = new World<
	Partial<Player & { position: Position; view: View } & Tower & Enemy>
>();

let appState: AppStateType = AppState.IN_GAME;

export const getAppState = (): AppStateType => appState;

export const setAppState = (state: AppStateType) => {
	appState = state;
};

export const pauseGame = () => {
	appState = AppState.PAUSED;
};

export const resumeGame = () => {
	appState = AppState.IN_GAME;
};

export const isPaused = () => appState === AppState.PAUSED;
