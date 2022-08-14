import { PlayerType } from "isaac-typescript-definitions";
import g from "../../../globals";

export const SEASON_3_CHARACTERS: readonly PlayerType[] = [
  PlayerType.JUDAS, // 3
  PlayerType.BLUE_BABY, // 4
  PlayerType.SAMSON, // 6
  PlayerType.LAZARUS, // 8
  PlayerType.JACOB, // 19
  PlayerType.JUDAS_B, // 24
  PlayerType.LILITH_B, // 32
];

/** How long the randomly-selected character & build combination is "locked-in". */
const SEASON_3_LOCK_MINUTES = g.debug ? 0.01 : 1.25;
export const SEASON_3_LOCK_SECONDS = SEASON_3_LOCK_MINUTES * 60;
export const SEASON_3_LOCK_MILLISECONDS = SEASON_3_LOCK_SECONDS * 1000;
