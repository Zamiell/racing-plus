import { FastTravelEntityState } from "./enums";

export const DEBUG = false;

export interface FastTravelEntityDescription {
  initial: boolean;
  state: FastTravelEntityState;
}

export const ANIMATIONS_THAT_PREVENT_FAST_TRAVEL: ReadonlySet<string> = new Set(
  [
    "Happy",
    "Sad",
    "Jump",
    "RollingLeft",
    "RollingRight",
    "RollingDown",
    "RollingUp",
  ],
);

/** This also applies to crawlspaces. The value was determined through trial and error. */
export const TRAPDOOR_OPEN_DISTANCE = 60;

export const TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS = TRAPDOOR_OPEN_DISTANCE * 2.5;
export const TRAPDOOR_BOSS_REACTION_FRAMES = 30;

/**
 * This also applies to crawlspaces. The value was determined through trial and error. The distance
 * is slightly smaller than vanilla.
 */
export const TRAPDOOR_TOUCH_DISTANCE = 16.5;

export const FADE_TO_BLACK_FRAMES = 40;
export const FRAMES_BEFORE_JUMP = 13;
