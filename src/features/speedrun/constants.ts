import { Challenge } from "isaac-typescript-definitions";
import { ReadonlyMap, ReadonlySet } from "isaacscript-common";
import { ChallengeCustom } from "../../enums/ChallengeCustom";

export enum ChallengeCustomAbbreviation {
  SEASON_1 = "R7S1",
  SEASON_2 = "R7S2",
  SEASON_3 = "R7S3",
  SEASON_4 = "R7S4",
}

export const CHALLENGE_DEFINITIONS = new ReadonlyMap<
  Challenge,
  [challengeCustomAbbreviation: ChallengeCustomAbbreviation, numElements: int]
>([
  [ChallengeCustom.SEASON_1, [ChallengeCustomAbbreviation.SEASON_1, 7]],
  [ChallengeCustom.SEASON_2, [ChallengeCustomAbbreviation.SEASON_2, 3]],
  [ChallengeCustom.SEASON_3, [ChallengeCustomAbbreviation.SEASON_3, 0]], // There are no choices for Season 3.
  [ChallengeCustom.SEASON_4, [ChallengeCustomAbbreviation.SEASON_4, 0]], // There are no choices for Season 4.
]);

export const CUSTOM_CHALLENGES_SET = new ReadonlySet<Challenge>(
  CHALLENGE_DEFINITIONS.keys(),
);
