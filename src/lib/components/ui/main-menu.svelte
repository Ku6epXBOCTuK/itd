<script lang="ts">
	import { uiState, GameState } from "$lib/adapters/ui-state/game-state.svelte";

	function startGame() {
		uiState.gameState = GameState.PLAYING;
	}

	function openSettings() {
		uiState.gameState = GameState.SETTINGS;
	}

	function exitGame() {
		if (typeof window !== "undefined") {
			window.close();
		}
	}
</script>

<div class="main-menu">
	<div class="menu-content">
		<h1 class="title">Idle Tower Defense</h1>

		<div class="menu-buttons">
			<button class="menu-btn" onclick={startGame}>
				Начать игру
			</button>

			<button class="menu-btn" onclick={openSettings}>
				Настройки
			</button>

			<button class="menu-btn" onclick={exitGame}>
				Выход
			</button>
		</div>
	</div>
</div>

<style>
	.main-menu {
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

	.menu-content {
		text-align: center;
	}

	.title {
		font-size: 4rem;
		color: #fff;
		margin-bottom: 3rem;
		text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
	}

	.menu-buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.menu-btn {
		width: 250px;
		padding: 1rem 2rem;
		font-size: 1.5rem;
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
