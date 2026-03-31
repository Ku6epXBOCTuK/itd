import { World } from "miniplex";
import * as THREE from "three";

type Player = { gold: number; incomePerSecond: number };
type Position = { x: number; y: number; z: number };
type View = { mesh: THREE.Mesh; originalColor: number };
type Tower = { tower: true; hp: number; maxHp: number };
type Pause = { paused: true };
type Enemy = {
	type: string;
	state: string;
	speed: number;
	maxHp: number;
	currentHp: number;
	damage: number;
	attackRange: number;
	attackCooldown: number;
	attackDuration: number;
	attackStartTime: number;
	target: { x: number; y: number; z: number };
};

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
