import { PlayerType } from "isaac-typescript-definitions";

export const SEASON_3_CHARACTERS: readonly PlayerType[] = [
  PlayerType.JUDAS, // 3
  PlayerType.BLUE_BABY, // 4
  PlayerType.LAZARUS, // 8
  PlayerType.MAGDALENE_B, // 22
  PlayerType.JUDAS_B, // 24
  PlayerType.EVE_B, // 26
  PlayerType.JACOB_B, // 37
];

/** How long the randomly-selected character & build combination is "locked-in". */
const SEASON_3_LOCK_MINUTES = 1.25;
export const SEASON_3_LOCK_SECONDS = SEASON_3_LOCK_MINUTES * 60;
export const SEASON_3_LOCK_MILLISECONDS = SEASON_3_LOCK_SECONDS * 1000;
