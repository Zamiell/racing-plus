import { FastTravelEntityState } from "./enums";

export interface FastTravelEntityDescription {
  initial: boolean;
  state: FastTravelEntityState;
}

export const TRAPDOOR_OPEN_DISTANCE = 60; // Determined through trial and error
export const TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS = TRAPDOOR_OPEN_DISTANCE * 2.5;
export const TRAPDOOR_BOSS_REACTION_FRAMES = 30;
export const TRAPDOOR_TOUCH_DISTANCE = 16.5; // Determined through trial and error
// (it is slightly smaller than vanilla)

export const FADE_TO_BLACK_FRAMES = 40;
export const FAMES_BEFORE_JUMP = 13;
