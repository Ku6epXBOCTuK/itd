<script lang="ts">
	import { uiState, GameState } from "$lib/adapters/ui-state/game-state.svelte";
	import { initializeGameState, resetGameState } from "$lib/modules/economy/factories";
	import Button from "$lib/components/ui/button.svelte";
	import IconRotateCcw from "~icons/lucide/rotate-ccw";
	import IconLogOut from "~icons/lucide/log-out";

	function restartGame() {
		initializeGameState();
	}

	function exitToMenu() {
		resetGameState();
		uiState.gameState = GameState.MENU;
	}
</script>

<div class="game-over">
	<div class="game-over-content">
		<h1 class="title">Игра окончена!</h1>
		<p class="subtitle">Башня разрушена</p>

		<div class="buttons">
			<Button icon={IconRotateCcw} label="Начать заново" onclick={restartGame} />

			<Button icon={IconLogOut} label="Выйти в меню" onclick={exitToMenu} variant="outline" />
		</div>
	</div>
</div>

<style>
	.game-over {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.9);
		z-index: 100;
	}

	.game-over-content {
		text-align: center;
		background: rgba(255, 255, 255, 0.1);
		padding: 3rem 4rem;
		border-radius: 1rem;
	}

	.title {
		font-size: 3.5rem;
		color: #ff4444;
		margin-bottom: 0.5rem;
		text-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
	}

	.subtitle {
		font-size: 1.5rem;
		color: #fff;
		margin-bottom: 2rem;
		opacity: 0.8;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}
</style>
