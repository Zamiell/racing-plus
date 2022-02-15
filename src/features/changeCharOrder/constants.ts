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
    buildPositions: [[0, 0, 0]],
    numBuildVetos: 3,
  },
};
