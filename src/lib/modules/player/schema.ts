export type UpgradeComponent = {
	upgrades: true;
	towerDamageFlatLevel: number;
	towerDamagePercentLevel: number;
};

export type Player = {
	player: true;
	gold: number;
	incomePerSecond: number;
	upgrades: UpgradeComponent;
};
