export const AttackPhase = {
	WINDUP: "windup",
	RECOVER: "recover",
	COOLDOWN: "cooldown",
} as const;

export type AttackPhaseType = (typeof AttackPhase)[keyof typeof AttackPhase];

export const AttackVariant = {
	MELEE: "melee",
	PROJECTILE: "projectile",
} as const;

export type AttackVariantType =
	(typeof AttackVariant)[keyof typeof AttackVariant];

export type AttackState = {
	attackPhase: AttackPhaseType;
	timer: number;
	type: AttackVariantType;
	windupDuration: number;
	recoveryDuration: number;
	cooldownDuration: number;
};
