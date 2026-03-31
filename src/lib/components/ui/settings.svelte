<script lang="ts">
	import { uiState, GameState } from "$lib/adapters/ui-state/game-state.svelte";
	import Button from "$lib/components/ui/button.svelte";
	import IconArrowLeft from "~icons/lucide/arrow-left";
	import IconVolume2 from "~icons/lucide/volume-2";
	import IconVolumeX from "~icons/lucide/volume-x";

	function goBack() {
		uiState.gameState = GameState.MENU;
	}
</script>

<div class="settings">
	<div class="settings-content">
		<h1 class="title">Настройки</h1>

		<div class="settings-group">
			<div class="setting-row">
				<span class="label-text">Громкость музыки</span>
				<input
					type="range"
					min="0"
					max="100"
					disabled={!uiState.settings.musicEnabled}
					value={uiState.settings.musicVolume}
					oninput={(e) => uiState.settings.musicVolume = parseInt(e.currentTarget.value)}
				/>
				<span class="value">{uiState.settings.musicVolume}%</span>
				<Button
					icon={uiState.settings.musicEnabled ? IconVolume2 : IconVolumeX}
					variant={uiState.settings.musicEnabled ? "primary" : "outline"}
					onclick={() => uiState.settings.musicEnabled = !uiState.settings.musicEnabled}
				/>
			</div>

			<div class="setting-row">
				<span class="label-text">Громкость звуков</span>
				<input
					type="range"
					min="0"
					max="100"
					disabled={!uiState.settings.sfxEnabled}
					value={uiState.settings.sfxVolume}
					oninput={(e) => uiState.settings.sfxVolume = parseInt(e.currentTarget.value)}
				/>
				<span class="value">{uiState.settings.sfxVolume}%</span>
				<Button
					icon={uiState.settings.sfxEnabled ? IconVolume2 : IconVolumeX}
					variant={uiState.settings.sfxEnabled ? "primary" : "outline"}
					onclick={() => uiState.settings.sfxEnabled = !uiState.settings.sfxEnabled}
				/>
			</div>
		</div>

		<Button icon={IconArrowLeft} label="Назад" onclick={goBack} variant="outline" />
	</div>
</div>

<style>
	.settings {
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

	.settings-content {
		background: rgba(255, 255, 255, 0.1);
		padding: 3rem;
		border-radius: 1rem;
		min-width: 400px;
	}

	.title {
		font-size: 2.5rem;
		color: #fff;
		margin-bottom: 2rem;
		text-align: center;
	}

	.settings-group {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.setting-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.setting-row .label-text {
		color: #fff;
		font-size: 1.1rem;
		min-width: 150px;
	}

	.setting-row input[type="range"] {
		flex: 1;
		height: 8px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 4px;
		outline: none;
		cursor: pointer;
	}

	.setting-row input[type="range"]:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.setting-row input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 20px;
		height: 20px;
		background: #667eea;
		border-radius: 50%;
		cursor: pointer;
	}

	.setting-row input[type="range"]:disabled::-webkit-slider-thumb {
		background: #999;
		cursor: not-allowed;
	}

	.setting-row input[type="range"]::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: #667eea;
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}

	.setting-row input[type="range"]:disabled::-moz-range-thumb {
		background: #999;
		cursor: not-allowed;
	}

	.setting-row .value {
		color: #fff;
		min-width: 50px;
		text-align: right;
	}
</style>
