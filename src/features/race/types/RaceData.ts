import RaceDifficulty from "./RaceDifficulty";
import RaceFormat from "./RaceFormat";
import RaceGoal from "./RaceGoal";
import RacerStatus from "./RacerStatus";
import RaceStatus from "./RaceStatus";

// The possible types for values of RaceData
export type RaceDataType = boolean | number | string | int[];

/** This must match the "ModSocket" class on the client. */
export default class RaceData {
  /** -1 if a race is not going on. */
  raceID = -1;
  status = RaceStatus.NONE;
  myStatus = RacerStatus.NOT_READY;
  ranked = false;
  solo = false;
  format = RaceFormat.UNSEEDED;
  difficulty = RaceDifficulty.NORMAL;
  character = PlayerType.PLAYER_JUDAS;
  goal = RaceGoal.BLUE_BABY;
  /** Corresponds to the seed that is the race goal. */
  seed = "-";
  /** The starting items for this race, if any. */
  startingItems: int[] = [];
  /** This corresponds to the graphic to draw on the screen. */
  countdown = -1;
  /**
   * This is either the number of people ready (in a pre-race)
   * or the non-finished place (in a race).
   */
  placeMid = 0;
  /** This is the final place. */
  place = -1;
  /** In a pre-race, the number of people who have readied up. */
  numReady = 0;
  /** The number of people in the race. */
  numEntrants = 1;
}

export function cloneRaceData(raceData: RaceData): RaceData {
  const copiedRaceData = { ...raceData }; // Shallow copy
  copiedRaceData.startingItems = [...raceData.startingItems]; // Copy nested arrays
  return copiedRaceData;
}
