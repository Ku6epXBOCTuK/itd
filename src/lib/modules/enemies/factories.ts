import {
	EnemyState,
	EnemyVariant,
	world,
	type EnemyVariantType,
	type Position,
	type View,
} from "$lib/core/world";
import * as THREE from "three";
import { createHpBarSprite } from "./hp-bar";
import {
	ENEMY_COLORS,
	ENEMY_CONFIGS,
	ENEMY_SPAWN,
	GEOMETRY,
} from "$lib/core/game-config";

export { EnemyVariant };

type EnemyStats = (typeof ENEMY_CONFIGS)[EnemyVariantType];

export const createEnemy = (
	type: keyof typeof ENEMY_CONFIGS,
	x: number,
	z: number,
) => {
	const stats = ENEMY_CONFIGS[type] as EnemyStats;

	const geometry = new THREE.SphereGeometry(
		GEOMETRY.enemy.radius,
		GEOMETRY.enemy.segments,
		GEOMETRY.enemy.segments,
	);
	const material = new THREE.MeshStandardMaterial({
		color: ENEMY_COLORS[EnemyState.MOVING],
	});
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, ENEMY_SPAWN.y, z);
	mesh.castShadow = true;

	const hpBarSprite = createHpBarSprite();

	const enemy = world.add({
		position: { x, y: ENEMY_SPAWN.y, z } as Position,
		view: { mesh, originalColor: ENEMY_COLORS[EnemyState.MOVING] } as View,
		enemy: {
			enemy: true,
			type: type as EnemyVariantType,
			enemyState: EnemyState.MOVING,
			speed: stats.speed,
			hp: stats.hp,
			maxHp: stats.maxHp,
			damage: stats.damage,
			attackRange: stats.attackRange,
			attackCooldown: stats.attackCooldown,
			attackDuration: stats.attackDuration,
			attackStartTime: 0,
			deathStartTime: 0,
			target: { x: 0, y: 1, z: 0 },
			sprite: hpBarSprite,
		},
	});

	return enemy;
};
