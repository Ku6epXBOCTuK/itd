<script lang="ts">
	import { onMount } from "svelte";
	import { appState, AppState } from "$lib/core/app-state.svelte";
	import { initGameStateMachine } from "$lib/core/game-state-machine.svelte";
	import { setCanvas } from "$lib/modules/render/systems/render.system";
	import MainMenu from "$lib/components/main-menu.svelte";
	import Settings from "$lib/components/settings.svelte";
	import GameOver from "$lib/components/game-over.svelte";
	import PauseMenu from "$lib/components/pause-menu.svelte";
	import Hud from "$lib/components/hud.svelte";
	import DebugPanel from "$lib/components/debug-panel.svelte";

	let canvas: HTMLCanvasElement;

	onMount(() => {
		setCanvas(canvas);
		initGameStateMachine();
	});
</script>

<div class="game-container">
	<canvas bind:this={canvas}></canvas>

	{#if appState.current === AppState.MENU}
		<MainMenu />
		<DebugPanel />
	{:else if appState.current === AppState.SETTINGS}
		<Settings />
		<DebugPanel />
	{:else if appState.current === AppState.GAME_OVER}
		<GameOver />
		<DebugPanel />
	{:else if appState.current === AppState.PAUSED}
		<PauseMenu />
		<Hud />
		<DebugPanel />
	{:else if appState.current === AppState.PLAYING || appState.current === AppState.GAME_OVER_ANIMATING}
		<Hud />
		<DebugPanel />
	{/if}
</div>

<style>
	.game-container {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
