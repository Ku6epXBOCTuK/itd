<script lang="ts">
	import { onMount } from "svelte";
	import { appState, AppState } from "$lib/core/app-state.svelte";
	import {
		initGameStateMachine,
		setGameCanvas,
	} from "$lib/core/game-state-machine.svelte";
	import MainMenu from "$lib/components/ui/main-menu.svelte";
	import Settings from "$lib/components/ui/settings.svelte";
	import GameOver from "$lib/components/ui/game-over.svelte";
	import PauseMenu from "$lib/components/ui/pause-menu.svelte";
	import Hud from "$lib/components/ui/hud.svelte";
	import DebugPanel from "$lib/components/ui/debug-panel.svelte";

	let canvas: HTMLCanvasElement;

	onMount(() => {
		setGameCanvas(canvas);
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
