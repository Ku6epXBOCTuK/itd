<script lang="ts">
	import { GameEngine, GameEvents } from "$lib/core/event-bus";
	import Button from "$lib/components/ui/button.svelte";
	import IconPlay from "~icons/lucide/play";
	import IconLogOut from "~icons/lucide/log-out";

	function handleResume() {
		GameEngine.emit(GameEvents.RESUME_GAME);
	}

	function exitToMenu() {
		GameEngine.emit(GameEvents.TO_MENU);
	}
</script>

<div class="pause-menu">
	<div class="pause-content">
		<h1 class="title">Пауза</h1>

		<div class="pause-buttons">
			<Button icon={IconPlay} label="Продолжить" onclick={handleResume} />

			<Button
				icon={IconLogOut}
				label="В главное меню"
				onclick={exitToMenu}
				variant="outline"
			/>
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
</style>
