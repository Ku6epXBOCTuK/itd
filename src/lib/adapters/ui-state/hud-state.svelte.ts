export interface HudState {
	gold: number;
	wave: number;
	towerHp: number;
	towerMaxHp: number;
	settings: {
		musicVolume: number;
		sfxVolume: number;
		musicEnabled: boolean;
		sfxEnabled: boolean;
	};
}

export const hudState = $state<HudState>({
	gold: 0,
	wave: 0,
	towerHp: 0,
	towerMaxHp: 0,
	settings: {
		musicVolume: 50,
		sfxVolume: 50,
		musicEnabled: true,
		sfxEnabled: true,
	},
});

export function resetHudState() {
	hudState.gold = 0;
	hudState.wave = 0;
	hudState.towerHp = 0;
	hudState.towerMaxHp = 0;
}
