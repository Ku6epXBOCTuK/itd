import type { Entity } from "$lib/core/world";

export const AttackPhase = {
	ACTIVE: "active",
	WINDUP: "windup",
	RECOVER: "recover",
} as const;

export type AttackPhaseType = (typeof AttackPhase)[keyof typeof AttackPhase];

export const AttackVariant = {
	MELEE: "melee",
	PROJECTILE_HOMING: "projectile_homing",
	PROJECTILE_BALLISTIC: "projectile_ballistic",
} as const;

export type AttackVariantType =
	(typeof AttackVariant)[keyof typeof AttackVariant];

export type AttackStats = {
	type: AttackVariantType;
	windupDuration: number;
	recoveryDuration: number;
	cooldownDuration: number;
};

export type ActiveAttack = {
	attackPhase: AttackPhaseType;
	timer: number;
};

export type ExecuteAttack = {
	attackVariant: AttackVariantType;
	damage: number;
	target: Entity;
};
