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

export default interface RaceData {
  /** Equal to our Racing+ user ID. */
  userID: int;
  /** 0 if a race is not going on. */
  raceID: int;
  status: RaceStatus;
  myStatus: RaceMyStatus;
  ranked: boolean;
  solo: boolean;
  rFormat: RaceFormat;
  difficulty: RaceDifficulty;
  character: PlayerType;
  goal: RaceGoal;
  /** Corresponds to the seed that is the race goal. */
  seed: string;
  /** The starting items for this race, if any. */
  startingItems: CollectibleType[];
  /** This corresponds to the graphic to draw on the screen. */
  countdown: int;
  /** This is either the number of people ready, or the non-finished place. */
  placeMid: int;
  /** This is the final place. */
  place: int;
  /** The number of people in the race. */
  numEntrants: int;
}
