import { PlayerType } from "isaac-typescript-definitions";
import g from "../../../globals";

export const SEASON_3_CHARACTERS: readonly PlayerType[] = [
  PlayerType.ISAAC, // 0
  PlayerType.JUDAS, // 3
  PlayerType.BLUE_BABY, // 4
  PlayerType.LAZARUS, // 8
  PlayerType.JUDAS_B, // 24
  PlayerType.EVE_B, // 26
  PlayerType.JACOB_B, // 37
];

/** How long the randomly-selected character & build combination is "locked-in". */
const SEASON_3_LOCK_MINUTES = g.debug ? 0.01 : 1.25;
const SEASON_3_LOCK_SECONDS = SEASON_3_LOCK_MINUTES * 60;
export const SEASON_3_LOCK_MILLISECONDS = SEASON_3_LOCK_SECONDS * 1000;

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
export const SEASON_3_GOALS: readonly Season3Goal[] = [
  Season3Goal.BLUE_BABY,
  Season3Goal.THE_LAMB,
  Season3Goal.MEGA_SATAN,
  Season3Goal.BOSS_RUSH,
  Season3Goal.HUSH,
  Season3Goal.MOTHER,
  Season3Goal.DOGMA,
];
