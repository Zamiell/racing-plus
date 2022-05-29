import { PlayerType } from "isaac-typescript-definitions";
import { SeasonDescription } from "../../types/SeasonDescription";

/** We use the Cellar because it is the cleanest floor. */
export const CHANGE_CHAR_ORDER_ROOM_STAGE_ARGUMENT = "1a";

/** This is a Cellar room with 1 Gaper in it and no grid entities. */
export const CHANGE_CHAR_ORDER_ROOM_VARIANT = 5;

// eslint-disable-next-line isaacscript/require-const-assertions
export const CHANGE_CHAR_ORDER_POSITIONS: Record<string, SeasonDescription> = {
  R7S1: {
    X: 4,
    Y: 2,
    numChars: 7,
    charPositions: [
      [PlayerType.ISAAC, 0, 1], // 0
      [PlayerType.ISAAC_B, 2, 1],

      [PlayerType.JUDAS, 5, 1], // 3
      [PlayerType.JUDAS_B, 7, 1],

      [PlayerType.AZAZEL, 10, 1], // 7
      [PlayerType.AZAZEL_B, 12, 1],

      [PlayerType.THE_LOST, 0, 3], // 10
      [PlayerType.THE_LOST_B, 2, 3],

      [PlayerType.KEEPER, 10, 3], // 12
      [PlayerType.KEEPER_B, 12, 3],

      [PlayerType.APOLLYON, 0, 5], // 13
      [PlayerType.APOLLYON_B, 2, 5],

      [PlayerType.BETHANY, 10, 5], // 18
      [PlayerType.BETHANY_B, 12, 5],
    ],
  },

  R7S2: {
    X: 8,
    Y: 2,
    numChars: 7,
    charPositions: [],
    buildPositions: [
      [0, 0, 0],
      [1, 1, 0],
      [2, 2, 0],
      [3, 3, 0],
      [4, 4, 0],
      [5, 5, 0],
      [6, 6, 0],
      [7, 7, 0],
      [8, 8, 0],
      [9, 9, 0],
      [10, 10, 0],
      [11, 11, 0],
      [12, 12, 0],

      [13, 1, 2],
      [14, 2, 2],
      [15, 3, 2],
      [16, 4, 2],
      [17, 5, 2],
      // Skip center column.
      [18, 7, 2],
      [19, 8, 2],
      [20, 9, 2],
      [21, 10, 2],
      [22, 11, 2],

      [23, 4, 4],
      [24, 5, 4],
      // Skip center column.
      [25, 7, 4],
      [26, 8, 4],
    ],
    numBuildVetos: 3,
  },
};
