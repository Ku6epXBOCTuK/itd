<script lang="ts">
	import { uiState, GameState } from "$lib/adapters/ui-state/game-state.svelte";

	function goBack() {
		uiState.gameState = GameState.MENU;
	}
</script>

<div class="settings">
	<div class="settings-content">
		<h1 class="title">Настройки</h1>

		<div class="settings-group">
			<div class="setting-row">
				<label>Громкость музыки</label>
				<input
					type="range"
					min="0"
					max="100"
					value={uiState.settings.musicVolume}
					oninput={(e) => uiState.settings.musicVolume = parseInt(e.currentTarget.value)}
				/>
				<span class="value">{uiState.settings.musicVolume}%</span>
			</div>

			<div class="setting-row">
				<label>Громкость звуков</label>
				<input
					type="range"
					min="0"
					max="100"
					value={uiState.settings.sfxVolume}
					oninput={(e) => uiState.settings.sfxVolume = parseInt(e.currentTarget.value)}
				/>
				<span class="value">{uiState.settings.sfxVolume}%</span>
			</div>

			<div class="setting-row">
				<label>Музыка</label>
				<button
					class="toggle-btn"
					class:enabled={uiState.settings.musicEnabled}
					onclick={() => uiState.settings.musicEnabled = !uiState.settings.musicEnabled}
				>
					{uiState.settings.musicEnabled ? "ВКЛ" : "ВЫКЛ"}
				</button>
			</div>

			<div class="setting-row">
				<label>Звуки</label>
				<button
					class="toggle-btn"
					class:enabled={uiState.settings.sfxEnabled}
					onclick={() => uiState.settings.sfxEnabled = !uiState.settings.sfxEnabled}
				>
					{uiState.settings.sfxEnabled ? "ВКЛ" : "ВЫКЛ"}
				</button>
			</div>
		</div>

		<button class="back-btn" onclick={goBack}>
			Назад
		</button>
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
		gap: 1rem;
	}

	.setting-row label {
		color: #fff;
		font-size: 1.1rem;
		min-width: 150px;
	}

	.setting-row input[type="range"] {
		flex: 1;
		height: 8px;
		-webkit-appearance: none;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 4px;
		outline: none;
	}

	.setting-row input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 20px;
		height: 20px;
		background: #667eea;
		border-radius: 50%;
		cursor: pointer;
	}

	.setting-row .value {
		color: #fff;
		min-width: 50px;
		text-align: right;
	}

	.toggle-btn {
		padding: 0.5rem 1.5rem;
		font-size: 1rem;
		background: rgba(255, 255, 255, 0.2);
		color: #fff;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.toggle-btn.enabled {
		background: #667eea;
	}

	.back-btn {
		width: 100%;
		padding: 1rem;
		font-size: 1.2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.back-btn:hover {
		transform: translateY(-2px);
	}
</style>
