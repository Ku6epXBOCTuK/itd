export const ProjectileVariant = {
	HOMING: "homing",
	BALLISTIC: "ballistic",
	ORBIT: "orbit",
} as const;

export type ProjectileVariantType =
	(typeof ProjectileVariant)[keyof typeof ProjectileVariant];
