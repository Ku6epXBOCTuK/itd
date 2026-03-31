import { World } from "miniplex";
import * as THREE from "three";

type Position = { x: number; y: number; z: number };
export type View3D = { mesh: THREE.Mesh };

export const world = new World();
