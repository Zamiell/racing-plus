export const NUM_DIVERSITY_PASSIVE_COLLECTIBLES = 3;

export enum Season3Goal {
  BLUE_BABY = "Blue Baby",
  THE_LAMB = "The Lamb",
  MEGA_SATAN = "Mega Satan",
  BOSS_RUSH = "Boss Rush",
  HUSH = "Hush",
  MOTHER = "Mother",
  DOGMA = "Dogma",
}

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
