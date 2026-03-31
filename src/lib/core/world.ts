import { World } from "miniplex";
import * as THREE from "three";

type Player = { gold: number; incomePerSecond: number };
type Position = { x: number; y: number; z: number };
type View = { mesh: THREE.Mesh; originalColor: number };
type Tower = { tower: true; hp: number; maxHp: number };
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
	Partial<Player & { position: Position; view: View } & Tower & Enemy>
>();
