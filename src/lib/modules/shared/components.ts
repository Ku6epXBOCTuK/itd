export const AttackPhase = {
	ACTIVE: "active",
	WINDUP: "windup",
	RECOVER: "recover",
} as const;

export type AttackPhaseType = (typeof AttackPhase)[keyof typeof AttackPhase];

export const AttackVariant = {
	MELEE: "melee",
	PROJECTILE: "projectile",
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
};
