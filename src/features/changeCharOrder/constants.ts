import SeasonDescription from "./types/SeasonDescription";

// The format of "charPosition" is: character ID, X, Y
export const CHANGE_CHAR_ORDER_POSITIONS: Record<string, SeasonDescription> = {
  R7S1: {
    X: 6,
    Y: 2,
    charPositions: [
      [PlayerType.PLAYER_ISAAC, 2, 1], // 0
      [PlayerType.PLAYER_JUDAS, 4, 1], // 3
      [PlayerType.PLAYER_AZAZEL, 6, 1], // 7
      [PlayerType.PLAYER_THELOST, 8, 1], // 10
      [PlayerType.PLAYER_KEEPER, 10, 1], // 12
      [PlayerType.PLAYER_APOLLYON, 5, 3], // 13
      [PlayerType.PLAYER_BETHANY, 7, 3], // 18
    ],
  },
};
