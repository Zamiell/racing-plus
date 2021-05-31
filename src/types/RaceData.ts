type RaceStatus = "none" | "open" | "starting" | "in progress";
type RaceMyStatus = "not ready" | "ready" | "racing";
type RaceFormat = "unseeded" | "seeded" | "diversity" | "custom" | "pageant";
type RaceDifficulty = "normal" | "hard";

export type RaceGoal =
  | "Blue Baby"
  | "The Lamb"
  | "Mega Satan"
  | "Hush"
  | "Delirium"
  | "Boss Rush"
  | "Everything"
  | "Custom";

export default class RaceData {
  /** Equal to our Racing+ user ID. */
  userID = 0;
  /** 0 if a race is not going on. */
  raceID = 0;
  status: RaceStatus = "none";
  myStatus: RaceMyStatus = "not ready";
  ranked = false;
  solo = false;
  rFormat: RaceFormat = "unseeded";
  difficulty: RaceDifficulty = "normal";
  character = PlayerType.PLAYER_JUDAS;
  goal: RaceGoal = "Blue Baby";
  /** Corresponds to the seed that is the race goal. */
  seed = "-";
  /** The starting items for this race, if any. */
  startingItems: CollectibleType[] = [];
  /** This corresponds to the graphic to draw on the screen. */
  countdown = -1;
  /** This is either the number of people ready, or the non-finished place. */
  placeMid = 0;
  /** This is the final place. */
  place = 1;
  /** The number of people in the race. */
  numEntrants = 1;

  finished = false;
}
