<script lang="ts">
	import { uiState, GameState } from "$lib/adapters/ui-state/game-state.svelte";

	function resumeGame() {
		uiState.isPaused = false;
	}

	function exitToMenu() {
		uiState.isPaused = false;
		uiState.gameState = GameState.MENU;
	}
</script>

<div class="pause-menu">
	<div class="pause-content">
		<h1 class="title">Пауза</h1>

		<div class="pause-buttons">
			<button class="menu-btn" onclick={resumeGame}>
				Продолжить
			</button>

			<button class="menu-btn" onclick={exitToMenu}>
				В главное меню
			</button>
		</div>
	</div>
</div>

<style>
	.pause-menu {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.85);
		z-index: 100;
	}

	.pause-content {
		text-align: center;
		background: rgba(255, 255, 255, 0.1);
		padding: 3rem 4rem;
		border-radius: 1rem;
	}

	.title {
		font-size: 3rem;
		color: #fff;
		margin-bottom: 2rem;
	}

	.pause-buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.menu-btn {
		width: 250px;
		padding: 1rem 2rem;
		font-size: 1.3rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.menu-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
	}

	.menu-btn:active {
		transform: translateY(0);
	}
</style>
