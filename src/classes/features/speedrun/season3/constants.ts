import { ReadonlySet } from "isaacscript-common";
import { Season3Goal } from "../../../../enums/Season3Goal";

/** We can't use `getEnumValues` on `Season3Goal` because they will be in a random order. */
export const SEASON_3_GOALS = [
  Season3Goal.BLUE_BABY,
  Season3Goal.THE_LAMB,
  Season3Goal.MEGA_SATAN,
  Season3Goal.BOSS_RUSH,
  Season3Goal.HUSH,
  Season3Goal.MOTHER,
  Season3Goal.DOGMA,
] as const;

export const SEASON_3_GOALS_THROUGH_WOMB_1 = new ReadonlySet([
  Season3Goal.BLUE_BABY,
  Season3Goal.THE_LAMB,
  Season3Goal.MEGA_SATAN,
  Season3Goal.HUSH,
]);

/** One tile away from the bottom door in a 1x1 room. */
export const SEASON_3_INVERTED_TRAPDOOR_GRID_INDEX = 97;

export const NUM_DIVERSITY_PASSIVE_COLLECTIBLES = 3;
export const VANILLA_HUSH_SPAWN_POSITION = Vector(580, 260);
