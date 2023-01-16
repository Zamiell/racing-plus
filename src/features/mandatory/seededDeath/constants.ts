import {
  GAME_FRAMES_PER_SECOND,
  RENDER_FRAMES_PER_SECOND,
} from "isaacscript-common";

export const SEEDED_DEATH_DEBUG = false as boolean;
export const SEEDED_DEATH_FEATURE_NAME = "seededDeath";
const SEEDED_DEATH_DEBUFF_SECONDS = 45;
export const SEEDED_DEATH_DEBUFF_RENDER_FRAMES =
  SEEDED_DEATH_DEBUFF_SECONDS * RENDER_FRAMES_PER_SECOND;

export const SEEDED_DEATH_TIMER_STARTING_X = 65;
export const SEEDED_DEATH_TIMER_STARTING_Y = 79;
export const SEEDED_DEATH_TIMER_SEASON_OFFSET_X = 18;

/** The holding item animation lasts 1.3 seconds, so we round up to 2 seconds to be safe. */
export const DEVIL_DEAL_BUFFER_GAME_FRAMES = 2 * GAME_FRAMES_PER_SECOND;

export const SEEDED_DEATH_FADE_AMOUNT = 0.25;
