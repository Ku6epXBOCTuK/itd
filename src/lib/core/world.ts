import { World } from "miniplex";
import type { View } from "$lib/modules/render/render.components";
import type { Tower } from "$lib/modules/towers/towers.components";
import type { Enemy } from "$lib/modules/enemies/enemies.components";

type Player = { gold: number; incomePerSecond: number };
type Position = { x: number; y: number; z: number };
type Pause = { paused: true };

export const world = new World<
	Partial<Player & { position: Position; view: View } & Tower & Pause & Enemy>
>();

export const pauseGame = () => {
	const pauses = world.with("paused");
	let hasPause = false;
	for (const _ of pauses) {
		hasPause = true;
		break;
	}

	if (!hasPause) {
		world.add({ paused: true });
	}
};

export const resumeGame = () => {
	const pauses = world.with("paused");
	for (const pause of pauses) {
		world.remove(pause);
	}
};

export const isPaused = () => {
	const pauses = world.with("paused");
	for (const _ of pauses) {
		return true;
	}
	return false;
};
