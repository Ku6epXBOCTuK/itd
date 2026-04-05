import * as THREE from "three";

export const ViewId = {
	ENEMY: "enemy",
	TOWER: "tower",
	PROJECTILE: "projectile",
} as const;

export type ViewIdType = (typeof ViewId)[keyof typeof ViewId];

export const VisualStatus = {
	IDLE: "idle",
	MOVING: "moving",
	ATTACKING: "attacking",
	COOLDOWN: "cooldown",
	HAPPY: "happy",
	DYING: "dying",
} as const;

export type VisualStatusType = (typeof VisualStatus)[keyof typeof VisualStatus];

export type View = {
	mesh: THREE.Mesh;
	originalColor: number;
};
