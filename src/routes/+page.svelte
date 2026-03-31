<script lang="ts">
	import { onMount } from "svelte";
	import { GameLoop } from "$lib/core/game-loop";
	import { initializeGameState } from "$lib/modules/economy/factories";
	import { uiState, GameState } from "$lib/adapters/ui-state/game-state.svelte";
	import {
		initRender,
		resizeRenderer,
		disposeRenderer,
	} from "$lib/modules/render/systems/sync-render.system";
	import MainMenu from "$lib/components/ui/main-menu.svelte";
	import Settings from "$lib/components/ui/settings.svelte";
	import GameOver from "$lib/components/ui/game-over.svelte";
	import PauseMenu from "$lib/components/ui/pause-menu.svelte";
	import Hud from "$lib/components/ui/hud.svelte";

	let canvas: HTMLCanvasElement;
	let isGameRunning = false;

	function startGame() {
		if (isGameRunning) return;

		const { width, height } = canvas.getBoundingClientRect();
		initRender(canvas, width, height);
		initializeGameState();
		GameLoop.start();
		isGameRunning = true;
	}

	function stopGame() {
		if (!isGameRunning) return;

		GameLoop.stop();
		disposeRenderer();
		isGameRunning = false;
	}

	function handleResize() {
		if (!canvas) return;
		const { width, height } = canvas.getBoundingClientRect();
		resizeRenderer(width, height);
	}

	$effect(() => {
		if (uiState.gameState === GameState.PLAYING && !isGameRunning) {
			startGame();
		}

		if (
			(uiState.gameState === GameState.MENU ||
				uiState.gameState === GameState.SETTINGS ||
				uiState.gameState === GameState.GAME_OVER) &&
			isGameRunning
		) {
			stopGame();
		}

		return () => {
			if (isGameRunning) {
				stopGame();
			}
		};
	});
</script>

<div class="game-container">
	<canvas bind:this={canvas} onresize={handleResize}></canvas>

	{#if uiState.gameState === GameState.MENU}
		<MainMenu />
	{:else if uiState.gameState === GameState.SETTINGS}
		<Settings />
	{:else if uiState.gameState === GameState.GAME_OVER}
		<GameOver />
	{:else if uiState.gameState === GameState.PLAYING}
		{#if uiState.isPaused}
			<PauseMenu />
		{:else}
			<Hud />
		{/if}
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
