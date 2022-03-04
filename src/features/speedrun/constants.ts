import { ChallengeCustom } from "../../types/ChallengeCustom";

export const CHALLENGE_DEFINITIONS: ReadonlyMap<
  ChallengeCustom,
  [seasonAbbreviation: string, numElements: int]
> = new Map([
  [ChallengeCustom.SEASON_1, ["R7S1", 7]],
  [ChallengeCustom.SEASON_2, ["R7S2", 3]],
]);

export const CUSTOM_CHALLENGES_SET: ReadonlySet<ChallengeCustom> = new Set(
  CHALLENGE_DEFINITIONS.keys(),
);
