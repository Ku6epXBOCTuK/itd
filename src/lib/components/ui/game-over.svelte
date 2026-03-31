<script lang="ts">
	import { uiState, GameState } from "$lib/adapters/ui-state/game-state.svelte";

	function restartGame() {
		uiState.gameOver = false;
		uiState.towerHp = 0;
		uiState.towerMaxHp = 0;
		uiState.gameState = GameState.PLAYING;
	}

	function exitToMenu() {
		uiState.gameOver = false;
		uiState.towerHp = 0;
		uiState.towerMaxHp = 0;
		uiState.gameState = GameState.MENU;
	}
</script>

<div class="game-over">
	<div class="game-over-content">
		<h1 class="title">Игра окончена!</h1>
		<p class="subtitle">Башня разрушена</p>

		<div class="buttons">
			<button class="btn btn-restart" onclick={restartGame}>
				Начать заново
			</button>

			<button class="btn btn-exit" onclick={exitToMenu}>
				Выйти в меню
			</button>
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

	.btn {
		width: 250px;
		padding: 1rem 2rem;
		font-size: 1.3rem;
		color: #fff;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.btn-restart {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.btn-exit {
		background: rgba(255, 255, 255, 0.2);
	}

	.btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
	}

	.btn:active {
		transform: translateY(0);
	}
</style>
