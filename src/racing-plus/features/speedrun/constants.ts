import { ChallengeCustom } from "./enums";

// Values are the season abbreviations and the number of elements in the "character order" table
export const CHALLENGE_DEFINITIONS = new Map<ChallengeCustom, [string, int]>([
  [ChallengeCustom.SEASON_1, ["R7S1", 7]],
]);
