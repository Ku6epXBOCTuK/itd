<script lang="ts">
	import { hudState } from "$lib/adapters/ui-state/hud-state.svelte";
</script>

<div class="debug-panel">
	<div class="debug-item">FPS: {hudState.fps}</div>
	<div class="debug-item">Enemies: {hudState.enemyCount}</div>
	<div class="debug-item">Projectiles: {hudState.projectileCount}</div>
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
	}
</style>
