<script lang="ts">
	import { onMount } from "svelte";
	import { uiState, GameState } from "$lib/adapters/ui-state/game-state.svelte";
	import { initGameStateMachine, setGameCanvas } from "$lib/core/game-state-machine.svelte";
	import MainMenu from "$lib/components/ui/main-menu.svelte";
	import Settings from "$lib/components/ui/settings.svelte";
	import GameOver from "$lib/components/ui/game-over.svelte";
	import PauseMenu from "$lib/components/ui/pause-menu.svelte";
	import Hud from "$lib/components/ui/hud.svelte";

	let canvas: HTMLCanvasElement;

	onMount(() => {
		setGameCanvas(canvas);
		initGameStateMachine();
	});
</script>

<div class="game-container">
	<canvas bind:this={canvas}></canvas>

	{#if uiState.gameState === GameState.MENU}
		<MainMenu />
	{:else if uiState.gameState === GameState.SETTINGS}
		<Settings />
	{:else if uiState.gameState === GameState.GAME_OVER}
		<GameOver />
	{:else if uiState.gameState === GameState.PAUSED}
		<PauseMenu />
	{:else if uiState.gameState === GameState.PLAYING}
		<Hud />
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
