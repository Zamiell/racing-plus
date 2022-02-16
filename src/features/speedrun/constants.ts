import { ChallengeCustom } from "./enums";

export const CHALLENGE_DEFINITIONS = new Map<
  ChallengeCustom,
  [seasonAbbreviation: string, numElements: int]
>([
  [ChallengeCustom.SEASON_1, ["R7S1", 7]],
  [ChallengeCustom.SEASON_2, ["R7S2", 3]],
]);
