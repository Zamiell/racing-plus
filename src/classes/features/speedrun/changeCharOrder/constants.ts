import { PlayerType } from "isaac-typescript-definitions";
import { ReadonlyMap } from "isaacscript-common";
import type { SeasonDescription } from "../../../../interfaces/SeasonDescription";
import {
  BuildPosition,
  CharPosition,
} from "../../../../interfaces/SeasonDescription";
import { ChallengeCustomAbbreviation } from "../../../../speedrun/constants";

/** We use the Cellar because it is the cleanest floor. */
export const CHANGE_CHAR_ORDER_ROOM_STAGE_ARGUMENT = "1a";

/** This is a Cellar room with 1 Gaper in it and no grid entities. */
export const CHANGE_CHAR_ORDER_ROOM_VARIANT = 5;

export const CHANGE_CHAR_ORDER_POSITIONS_MAP = new ReadonlyMap<
  ChallengeCustomAbbreviation,
  SeasonDescription
>([
  [
    ChallengeCustomAbbreviation.SEASON_1,
    {
      X: 2,
      Y: 2,
      numChars: 7,
      charPositions: [
        new CharPosition(PlayerType.ISAAC, 0, 1), // 0
        new CharPosition(PlayerType.ISAAC_B, 2, 1),

        new CharPosition(PlayerType.JUDAS, 5, 1), // 3
        new CharPosition(PlayerType.JUDAS_B, 7, 1),

        new CharPosition(PlayerType.AZAZEL, 10, 1), // 7
        new CharPosition(PlayerType.AZAZEL_B, 12, 1),

        new CharPosition(PlayerType.LOST, 0, 3), // 10
        new CharPosition(PlayerType.LOST_B, 2, 3),

        new CharPosition(PlayerType.KEEPER, 10, 3), // 14
        new CharPosition(PlayerType.KEEPER_B, 12, 3),

        new CharPosition(PlayerType.APOLLYON, 0, 5), // 15
        new CharPosition(PlayerType.APOLLYON_B, 2, 5),

        new CharPosition(PlayerType.BETHANY, 10, 5), // 18
        new CharPosition(PlayerType.BETHANY_B, 12, 5),
      ],
    },
  ],

  [
    ChallengeCustomAbbreviation.SEASON_2,
    {
      X: 6,
      Y: 2,
      numChars: 7,
      charPositions: [],
      buildPositions: [
        new BuildPosition(0, 0, 0),
        new BuildPosition(1, 1, 0),
        new BuildPosition(2, 2, 0),
        new BuildPosition(3, 3, 0),
        new BuildPosition(4, 4, 0),
        new BuildPosition(5, 5, 0),
        new BuildPosition(6, 6, 0),
        new BuildPosition(7, 7, 0),
        new BuildPosition(8, 8, 0),
        new BuildPosition(9, 9, 0),
        new BuildPosition(10, 10, 0),
        new BuildPosition(11, 11, 0),
        new BuildPosition(12, 12, 0),

        new BuildPosition(13, 1, 2),
        new BuildPosition(14, 2, 2),
        new BuildPosition(15, 3, 2),
        new BuildPosition(16, 4, 2),
        new BuildPosition(17, 5, 2),
        // Skip center column.
        new BuildPosition(18, 7, 2),
        new BuildPosition(19, 8, 2),
        new BuildPosition(20, 9, 2),
        new BuildPosition(21, 10, 2),
        new BuildPosition(22, 11, 2),

        new BuildPosition(23, 4, 4),
        new BuildPosition(24, 5, 4),
      ],
    },
  ],

  [
    ChallengeCustomAbbreviation.SEASON_4,
    {
      X: 10,
      Y: 2,
      numChars: 7,
      charPositions: [
        new CharPosition(PlayerType.ISAAC, 2, 1), // 0
        new CharPosition(PlayerType.JUDAS, 4, 1), // 3
        new CharPosition(PlayerType.AZAZEL, 6, 1), // 7
        new CharPosition(PlayerType.LOST, 8, 1), // 10
        new CharPosition(PlayerType.LILITH, 10, 1), // 13
        new CharPosition(PlayerType.BETHANY, 2, 3), // 18
        new CharPosition(PlayerType.MAGDALENE_B, 10, 3), // 22
      ],
    },
  ],
]);
