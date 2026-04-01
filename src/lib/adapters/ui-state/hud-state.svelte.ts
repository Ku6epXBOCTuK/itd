export interface HudState {
	gold: number;
	wave: number;
	towerHp: number;
	towerMaxHp: number;
	waveAnnouncement: string;
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
	waveAnnouncement: "",
	settings: {
		musicVolume: 50,
		sfxVolume: 50,
		musicEnabled: true,
		sfxEnabled: true,
	},
});
