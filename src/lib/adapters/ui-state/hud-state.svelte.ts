export interface HudState {
	gold: number;
	wave: number;
	towerHp: number;
	towerMaxHp: number;
	fps: number;
	enemyCount: number;
	projectileCount: number;
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
	fps: 0,
	enemyCount: 0,
	projectileCount: 0,
	settings: {
		musicVolume: 50,
		sfxVolume: 50,
		musicEnabled: true,
		sfxEnabled: true,
	},
});
