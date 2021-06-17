import { CollectibleTypeCustom } from "../../../types/enums";

type RaceStatus = "none" | "open" | "starting" | "in progress";
type RacerStatus =
  | "not ready"
  | "ready"
  | "racing"
  | "finished"
  | "quit"
  | "disqualified";
type RaceFormat = "unseeded" | "seeded" | "diversity" | "custom";
type RaceDifficulty = "normal" | "hard";
type RaceGoal =
  | "Blue Baby"
  | "The Lamb"
  | "Mega Satan"
  | "Hush"
  | "Delirium"
  | "Boss Rush"
  | "custom";

/** This must match the "ModSocket" class on the client. */
export default class RaceData {
  /** -1 if a race is not going on. */
  raceID = -1;
  status: RaceStatus = "none";
  myStatus: RacerStatus = "not ready";
  ranked = false;
  solo = false;
  format: RaceFormat = "unseeded";
  difficulty: RaceDifficulty = "normal";
  character = PlayerType.PLAYER_JUDAS;
  goal: RaceGoal = "Blue Baby";
  /** Corresponds to the seed that is the race goal. */
  seed = "-";
  /** The starting items for this race, if any. */
  startingItems: Array<CollectibleType | CollectibleTypeCustom> = [];
  /** This corresponds to the graphic to draw on the screen. */
  countdown = -1;
  /**
   * This is either the number of people ready (in a pre-race)
   * or the non-finished place (in a race).
   */
  placeMid = 0;
  /** This is the final place. */
  place = -1;
  /** The number of people in the race. */
  numEntrants = 1;

  finished = false;

  clone(): RaceData {
    const copiedRaceData = { ...this }; // Shallow copy
    copiedRaceData.startingItems = { ...this.startingItems }; // Copy nested arrays
    return copiedRaceData;
  }
}
