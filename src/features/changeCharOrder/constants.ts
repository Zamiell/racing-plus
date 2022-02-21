import { SeasonDescription } from "./types/SeasonDescription";

export const CHANGE_CHAR_ORDER_POSITIONS: Record<string, SeasonDescription> = {
  R7S1: {
    X: 4,
    Y: 2,
    numChars: 7,
    charPositions: [
      [PlayerType.PLAYER_ISAAC, 0, 1], // 0
      [PlayerType.PLAYER_ISAAC_B, 2, 1],

      [PlayerType.PLAYER_JUDAS, 5, 1], // 3
      [PlayerType.PLAYER_JUDAS_B, 7, 1],

      [PlayerType.PLAYER_AZAZEL, 10, 1], // 7
      [PlayerType.PLAYER_AZAZEL_B, 12, 1],

      [PlayerType.PLAYER_THELOST, 0, 3], // 10
      [PlayerType.PLAYER_THELOST_B, 2, 3],

      [PlayerType.PLAYER_KEEPER, 10, 3], // 12
      [PlayerType.PLAYER_KEEPER_B, 12, 3],

      [PlayerType.PLAYER_APOLLYON, 0, 5], // 13
      [PlayerType.PLAYER_APOLLYON_B, 2, 5],

      [PlayerType.PLAYER_BETHANY, 10, 5], // 18
      [PlayerType.PLAYER_BETHANY_B, 12, 5],
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
      // Skip center column
      [18, 7, 2],
      [19, 8, 2],
      [20, 9, 2],
      [21, 10, 2],
      [22, 11, 2],

      [23, 4, 4],
      [24, 5, 4],
      // Skip center column
      [25, 7, 4],
      [26, 8, 4],
    ],
    numBuildVetos: 3,
  },
};
