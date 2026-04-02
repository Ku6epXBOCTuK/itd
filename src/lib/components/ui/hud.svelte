<script lang="ts">
	import { hudState } from "$lib/adapters/ui-state/hud-state.svelte";
	import { AppState, setAppState } from "$lib/core/app-state.svelte";
	import { GameEngine, GameEvents } from "$lib/core/event-bus";
	import { WAVE_CONFIG } from "$lib/core/game-config";
	import { PERCENT } from "$lib/core/constants";
	import IconSettings from "~icons/lucide/settings";

	function togglePause() {
		setAppState(AppState.PAUSED);
	}

	let showAnnouncement = $state(false);
	let announcement = $state("");
	let eventQueue = $state<string[]>([]);

	function showNextEvent() {
		if (eventQueue.length === 0) return;
		const [next, ...rest] = eventQueue;
		eventQueue = rest;
		announcement = next;
		showAnnouncement = true;
		setTimeout(() => {
			showAnnouncement = false;
			showNextEvent();
		}, WAVE_CONFIG.announcementDuration);
	}

	function showForDuration(text: string) {
		const isFirst = eventQueue.length === 0 && !showAnnouncement;
		eventQueue = [...eventQueue, text];
		if (isFirst) {
			showNextEvent();
		}
	}

	GameEngine.on(GameEvents.WAVE_START, (data) => {
		if (data && typeof data === "object" && "waveNumber" in data) {
			showForDuration(`Wave ${data.waveNumber} Starting...`);
		}
	});

	GameEngine.on(GameEvents.WAVE_COMPLETE, (data) => {
		if (data && typeof data === "object" && "waveNumber" in data) {
			showForDuration(`Wave ${data.waveNumber} Complete!`);
		}
	});
</script>

<div class="hud">
	<div class="hud-panel">
		<span class="gold-label">Золото:</span>
		<span class="gold-value">{hudState.gold}</span>
	</div>

	<div class="hud-panel">
		<span class="wave-label">Волна:</span>
		<span class="wave-value">{hudState.wave}</span>
	</div>

	<div class="hud-panel hp-panel">
		<span class="hp-label">HP башни:</span>
		<div class="hp-bar">
			<div
				class="hp-fill"
				style="width: {(hudState.towerHp / hudState.towerMaxHp) * PERCENT}%"
			></div>
		</div>
		<span class="hp-value">
			{Math.floor(hudState.towerHp)} / {Math.floor(hudState.towerMaxHp)}
		</span>
	</div>

	<button class="pause-btn" onclick={togglePause} title="Пауза">
		<IconSettings />
	</button>
</div>

{#if showAnnouncement}
	<div class="wave-announcement">
		{announcement}
	</div>
{/if}

<style>
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

	.hp-panel {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.hp-bar {
		width: 150px;
		height: 20px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 0.25rem;
		overflow: hidden;
	}

	.hp-fill {
		height: 100%;
		background: linear-gradient(90deg, #ff4444, #ff6b6b);
		transition: width 0.2s;
	}

	.hp-value {
		color: #fff;
		font-size: 1rem;
		min-width: 60px;
	}

	.pause-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		pointer-events: auto;
		transition:
			background 0.2s,
			transform 0.2s;
	}

	.pause-btn:hover {
		background: rgba(0, 0, 0, 0.9);
		transform: scale(1.05);
	}

	.wave-announcement {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(0, 0, 0, 0.9);
		color: #ff4444;
		padding: 1.5rem 3rem;
		border-radius: 0.5rem;
		font-family: sans-serif;
		font-size: 3rem;
		font-weight: bold;
		pointer-events: none;
		text-align: center;
	}
</style>
