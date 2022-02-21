import {
  GAME_FRAMES_PER_SECOND,
  ISAAC_FRAMES_PER_SECOND,
} from "isaacscript-common";

export const SEEDED_DEATH_DEBUG = false;
export const SEEDED_DEATH_DEBUFF_FRAMES = 45 * ISAAC_FRAMES_PER_SECOND;

export const SEEDED_DEATH_TIMER_STARTING_X = 65;
export const SEEDED_DEATH_TIMER_STARTING_Y = 79;
export const SEEDED_DEATH_TIMER_SEASON_OFFSET_X = 18;

/** The holding item animation lasts 1.3 seconds, so we round up to 2 seconds to be safe. */
export const DEVIL_DEAL_BUFFER_FRAMES = 2 * GAME_FRAMES_PER_SECOND;

export const QUARTER_FADED_COLOR = Color(1, 1, 1, 0.25);
