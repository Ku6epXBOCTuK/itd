import type {
	EnemyStateType,
	EnemyVariantType,
} from "$lib/modules/enemies/components";
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
export { TowerState } from "$lib/modules/towers/components";
export { WaveStatus } from "$lib/modules/waves/components";

export type Position = { x: number; y: number; z: number };

export type Entity = Partial<
	{
		position: Position;
		viewId: ViewIdType;

		isTower: true;
		isEnemy: true;
		isProjectile: true;
		isTargetable: true;
		isDying: true;
		isDead: true;

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
		projectileType: "homing" | "ballistic" | "orbit";

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
