<script lang="ts">
	import { AppState, setAppState } from "$lib/core/app-state.svelte";
	import { GameEngine, GameEvents } from "$lib/core/event-bus";
	import MenuLayout from "$lib/components/layouts/menu.svelte";
	import Button from "$lib/components/ui/button.svelte";
	import IconPlay from "~icons/lucide/play";
	import IconSettings from "~icons/lucide/settings";
	import IconLogOut from "~icons/lucide/log-out";

	function openSettings() {
		setAppState(AppState.SETTINGS);
	}

	function exitGame() {
		if (typeof window !== "undefined") {
			window.close();
		}
	}
</script>

<MenuLayout>
	<div class="menu-content">
		<h1 class="title">Idle Tower Defense</h1>

		<div class="menu-buttons">
			<Button
				icon={IconPlay}
				label="Начать игру"
				onclick={() => GameEngine.emit(GameEvents.START_GAME)}
			/>

			<Button icon={IconSettings} label="Настройки" onclick={openSettings} />

			<Button
				icon={IconLogOut}
				label="Выход"
				onclick={exitGame}
				variant="outline"
			/>
		</div>
	</div>
</MenuLayout>

<style>
	.menu-content {
		text-align: center;
		background: #1a1a2e;
		padding: 3rem 4rem;
		border-radius: 1rem;
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
