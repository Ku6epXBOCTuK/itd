<script lang="ts">
	import { uiState, GameState } from "$lib/adapters/ui-state/game-state.svelte";
	import { GameEngine, GameEvents } from "$lib/core/event-bus";
	import Button from "$lib/components/ui/button.svelte";
	import IconPlay from "~icons/lucide/play";
	import IconSettings from "~icons/lucide/settings";
	import IconLogOut from "~icons/lucide/log-out";

	function startGame() {
		GameEngine.emit(GameEvents.START_GAME);
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
			<Button icon={IconPlay} label="Начать игру" onclick={startGame} />

			<Button icon={IconSettings} label="Настройки" onclick={openSettings} />

			<Button icon={IconLogOut} label="Выход" onclick={exitGame} variant="outline" />
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
</style>
