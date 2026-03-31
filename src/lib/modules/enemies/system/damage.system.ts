import { world } from "$lib/core/world";
import { uiState } from "$lib/adapters/ui-state/game-state.svelte";

export const DamageSystem = (deltaTime: number) => {
	const enemies = world.with("position", "attackRange", "damage", "target");
	const towers = world.with("tower", "hp", "maxHp");

	for (const enemy of enemies) {
		const dx = enemy.target.x - enemy.position.x;
		const dy = enemy.target.y - enemy.position.y;
		const dz = enemy.target.z - enemy.position.z;
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

		if (distance <= enemy.attackRange) {
			for (const tower of towers) {
				tower.hp -= (enemy.damage * deltaTime) / 1000;

				if (tower.hp <= 0) {
					tower.hp = 0;
					uiState.gameOver = true;
				}

				uiState.towerHp = Math.floor(tower.hp);
			}
		}
	}
};
