<script lang="ts">
	import { onMount } from "svelte";
	import { GameLoop } from "$lib/core/game-loop";
	import { createGameState } from "$lib/modules/economy/factories";
	import { GameEngine } from "$lib/core/event-bus";
	import { uiState } from "$lib/adapters/ui-state/game-state.svelte";
	import {
		initRender,
		resizeRenderer,
		disposeRenderer,
	} from "$lib/modules/render/systems/sync-render.system";

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const { width, height } = canvas.getBoundingClientRect();
		initRender(canvas, width, height);
		createGameState();
		GameLoop.start();

		return () => {
			GameLoop.stop();
			disposeRenderer();
		};
	});

	function handleResize() {
		if (!canvas) return;
		const { width, height } = canvas.getBoundingClientRect();
		resizeRenderer(width, height);
	}
</script>

<div class="game-container">
	<canvas bind:this={canvas} onresize={handleResize}></canvas>

	<div class="hud">
		<div class="hud-panel">
			<span class="gold-label">Золото:</span>
			<span class="gold-value">{uiState.gold}</span>
		</div>

		<div class="hud-panel">
			<span class="wave-label">Волна:</span>
			<span class="wave-value">{uiState.wave}</span>
		</div>

		<button
			class="pause-btn"
			onclick={() => {
				if (uiState.isPaused) {
					GameEngine.emit("resume-game");
					uiState.isPaused = false;
				} else {
					GameEngine.emit("pause-game");
					uiState.isPaused = true;
				}
			}}
		>
			{uiState.isPaused ? "▶" : "⏸"}
		</button>
	</div>
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

	.hud {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		padding: 1rem;
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		pointer-events: none;
	}

	.hud-panel {
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-size: 1.25rem;
		font-weight: bold;
		pointer-events: auto;
	}

	.gold-value {
		color: #ffd700;
		margin-left: 0.5rem;
	}

	.wave-value {
		color: #ff6b6b;
		margin-left: 0.5rem;
	}

	.pause-btn {
		margin-left: auto;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-size: 1.25rem;
		cursor: pointer;
		pointer-events: auto;
		transition: background 0.2s;
	}

	.pause-btn:hover {
		background: rgba(0, 0, 0, 0.9);
	}
</style>
