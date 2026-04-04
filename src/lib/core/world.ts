import type {
	EnemyStateType,
	EnemyVariantType,
} from "$lib/modules/enemies/components";
import type { ProjectileVariantType } from "$lib/modules/projectiles/components";
import type {
	ViewIdType,
	VisualStatusType,
} from "$lib/modules/render/components";
import type {
	TowerBaseStats,
	TowerStateType,
} from "$lib/modules/towers/components";
import type { Upgrades } from "$lib/modules/upgrades/components";
import type { WaveControl } from "$lib/modules/waves/components";
import { World } from "miniplex";

export { EnemyState, EnemyVariant } from "$lib/modules/enemies/components";
export { ProjectileVariant } from "$lib/modules/projectiles/components";
export { TowerState } from "$lib/modules/towers/components";
export { WaveStatus } from "$lib/modules/waves/components";

export type Position = { x: number; y: number; z: number };

export type Entity = Partial<
	{
		position: Position;
		viewId: ViewIdType;

		towerTag: true;
		enemyTag: true;
		projectileTag: true;
		targetableTag: true;
		dyingTag: true;
		deadTag: true;

		gold: number;
		incomePerSecond: number;
		upgrades: Upgrades;

		hp: number;
		maxHp: number;
		damage: number;
		speed: number;
		attackRange: number;
		attackCooldown: number;

		towerState: TowerStateType;
		enemyState: EnemyStateType;
		enemyVariant: EnemyVariantType;
		visualStatus: VisualStatusType;
		projectileVariant: ProjectileVariantType;

		cooldownTimer: number;
		attackTimer: number;
		attackDuration: number;
		animationTimer: number;
		attackAnimationDuration: number;

		target: Entity;
		targetPosition: Position;
		radius: number;
		center: Position;
		lifetime: number;

		experienceValue: number;
		deathTimer: number;

		waveControl: WaveControl;
	} & TowerBaseStats
>;

export const world = new World<Entity>();
