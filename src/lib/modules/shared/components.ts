export const AttackPhase = {
	WINDUP: "windup",
	RECOVER: "recover",
	COOLDOWN: "cooldown",
} as const;

export type AttackPhaseType = (typeof AttackPhase)[keyof typeof AttackPhase];
