<script lang="ts">
	import { debugState } from "$lib/adapters/ui-state/debug-state.svelte";
</script>

<div class="debug-panel">
	<div class="debug-item">FPS: {debugState.fps}</div>
	<div class="debug-item">Enemies: {debugState.enemyCount}</div>
	<div class="debug-item">Projectiles: {debugState.projectileCount}</div>
	<div class="debug-item">Tower Damage: {debugState.towerDamage}</div>
</div>

<style>
	.debug-panel {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-family: monospace;
		font-size: 0.8rem;
		pointer-events: none;
		z-index: 200;
	}
</style>
