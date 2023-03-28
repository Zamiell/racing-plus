import { ReadonlySet } from "isaacscript-common";

export const FAST_TRAVEL_DEBUG = false as boolean;
export const FAST_TRAVEL_FEATURE_NAME = "fastTravel";

export const ANIMATIONS_THAT_PREVENT_FAST_TRAVEL = new ReadonlySet<string>([
  "Death",
  "Happy",
  "Sad",
  "Jump",
  "RollingLeft",
  "RollingRight",
  "RollingDown",
  "RollingUp",
]);

/** The value was determined through trial and error. */
export const TRAPDOOR_AND_CRAWL_SPACE_OPEN_DISTANCE = 60;

export const TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS =
  TRAPDOOR_AND_CRAWL_SPACE_OPEN_DISTANCE * 2.5;
export const TRAPDOOR_BOSS_REACTION_FRAMES = 30;

/**
 * The value was determined through trial and error. The distance is slightly smaller than vanilla.
 */
export const TRAPDOOR_AND_CRAWL_SPACE_TOUCH_DISTANCE = 16.5;

export const FADE_TO_BLACK_FRAMES = 40;
export const FRAMES_BEFORE_JUMP = 13;
