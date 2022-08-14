import { Challenge } from "isaac-typescript-definitions";
import { ChallengeCustom } from "../../enums/ChallengeCustom";

export const CHALLENGE_DEFINITIONS: ReadonlyMap<
  Challenge,
  [seasonAbbreviation: string, numElements: int]
> = new Map([
  [ChallengeCustom.SEASON_1, ["R7S1", 7]],
  [ChallengeCustom.SEASON_2, ["R7S2", 3]],
  [ChallengeCustom.SEASON_3, ["R7S3", 0]], // There are no choices for Season 3.
]);

export const CUSTOM_CHALLENGES_SET: ReadonlySet<Challenge> = new Set(
  CHALLENGE_DEFINITIONS.keys(),
);
