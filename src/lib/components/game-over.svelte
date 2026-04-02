<script lang="ts">
	import { GameEngine, GameEvents } from "$lib/core/event-bus";
	import MenuLayout from "$lib/components/layouts/menu.svelte";
	import Button from "$lib/components/ui/button.svelte";
	import IconRotateCcw from "~icons/lucide/rotate-ccw";
	import IconLogOut from "~icons/lucide/log-out";

	function restartGame() {
		GameEngine.emit(GameEvents.START_GAME);
	}

	function exitToMenu() {
		GameEngine.emit(GameEvents.TO_MENU);
	}
</script>

<MenuLayout>
	<div class="game-over-content">
		<h1 class="title">Игра окончена!</h1>
		<p class="subtitle">Башня разрушена</p>

		<div class="buttons">
			<Button
				icon={IconRotateCcw}
				label="Начать заново"
				onclick={restartGame}
			/>

			<Button
				icon={IconLogOut}
				label="Выйти в меню"
				onclick={exitToMenu}
				variant="outline"
			/>
		</div>
	</div>
</MenuLayout>

<style>
	.game-over-content {
		text-align: center;
		background: #1a1a2e;
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
