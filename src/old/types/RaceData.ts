type RaceStatus = "none" | "open" | "starting" | "in progress";
type RaceMyStatus = "not ready" | "ready" | "racing";
type RaceFormat = "unseeded" | "seeded" | "diversity" | "custom" | "pageant";
type RaceDifficulty = "normal" | "hard";
type RaceGoal =
  | "Blue Baby"
  | "The Lamb"
  | "Mega Satan"
  | "Hush"
  | "Delirium"
  | "Boss Rush"
  | "Everything"
  | "Custom";

export default interface RaceData {
  userID: int; // Equal to our Racing+ user ID
  raceID: int; // 0 if a race is not going on
  status: RaceStatus;
  myStatus: RaceMyStatus;
  ranked: boolean;
  solo: boolean;
  rFormat: RaceFormat;
  difficulty: RaceDifficulty;
  character: PlayerType;
  goal: RaceGoal;
  seed: string; // Corresponds to the seed that is the race goal
  startingItems: CollectibleType[]; // The starting items for this race, if any
  countdown: int; // This corresponds to the graphic to draw on the screen
  placeMid: int; // This is either the number of people ready, or the non-finished place
  place: int; // This is the final place
  numEntrants: int; // The number of people in the race
}
