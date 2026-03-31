import { world } from "$lib/core/world";

export const AttackSystem = (deltaTime: number) => {
	const enemies = world.with("position", "target", "attackRange", "damage");

	for (const enemy of enemies) {
		const dx = enemy.target.x - enemy.position.x;
		const dy = enemy.target.y - enemy.position.y;
		const dz = enemy.target.z - enemy.position.z;
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

		if (distance <= enemy.attackRange) {
			console.log(`Enemy deals ${enemy.damage} damage to tower!`);
		}
	}
};
