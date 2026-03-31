import { World } from "miniplex";
import * as THREE from "three";

type Player = { gold: number; incomePerSecond: number };
type Position = { x: number; y: number; z: number };
type View = { mesh: THREE.Mesh };
type Tower = { tower: true; hp: number; maxHp: number };
type Enemy = {
	type: string;
	speed: number;
	maxHp: number;
	currentHp: number;
	damage: number;
	attackRange: number;
	target: { x: number; y: number; z: number };
};

export const world = new World<
	Partial<Player & { position: Position; view: View } & Tower & Enemy>
>();
