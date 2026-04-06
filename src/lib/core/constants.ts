export const GAME_FPS = 60;
export const SECOND_MS = 1000;
export const FRAME_MS = SECOND_MS / GAME_FPS;
export const PERCENT = 100;
export const FPS_HISTORY_SIZE = 60;
export const GAME_OVER_ANIMATION_DURATION = 3000;
export const VELOCITY_EPSILON = 0.001;

export const RENDER = {
	BASE_SCALE: 1,
	ATTACK_SCALE: 1.1,
	DYING_SCALE: 0,
	SCALE_LERP: 0.2,
	ROTATION_LERP: 0.1,
} as const;
