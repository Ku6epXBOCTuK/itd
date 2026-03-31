import { World } from "miniplex";

type Player = { gold: number; incomePerSecond: number };

export const world = new World<Partial<Player>>();
