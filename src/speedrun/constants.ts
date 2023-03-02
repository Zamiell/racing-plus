import { Challenge } from "isaac-typescript-definitions";
import { ReadonlyMap, ReadonlySet } from "isaacscript-common";
import { ChallengeCustom } from "../enums/ChallengeCustom";

export enum ChallengeCustomAbbreviation {
  SEASON_1 = "R7S1",
  SEASON_2 = "R7S2",
  SEASON_3 = "R7S3",
  SEASON_4 = "R7S4",
}

export const CHALLENGE_DEFINITIONS = new ReadonlyMap<
  Challenge,
  { challengeCustomAbbreviation: ChallengeCustomAbbreviation; numElements: int }
>([
  [
    ChallengeCustom.SEASON_1,
    {
      challengeCustomAbbreviation: ChallengeCustomAbbreviation.SEASON_1,
      numElements: 7,
    },
  ],
  [
    ChallengeCustom.SEASON_2,
    {
      challengeCustomAbbreviation: ChallengeCustomAbbreviation.SEASON_2,
      numElements: 3,
    },
  ],
  [
    ChallengeCustom.SEASON_3,
    {
      challengeCustomAbbreviation: ChallengeCustomAbbreviation.SEASON_3,
      numElements: 0, // There are no choices for Season 3.
    },
  ],
  [
    ChallengeCustom.SEASON_4,
    {
      challengeCustomAbbreviation: ChallengeCustomAbbreviation.SEASON_4,
      numElements: 0, // There are no choices for Season 4.
    },
  ],
]);

export const CUSTOM_CHALLENGES_SET = new ReadonlySet<Challenge>(
  CHALLENGE_DEFINITIONS.keys(),
);

export const CUSTOM_CHALLENGES_THAT_ALTERNATE_BETWEEN_CHEST_AND_DARK_ROOM =
  new ReadonlySet<Challenge>([
    ChallengeCustom.SEASON_2,
    ChallengeCustom.SEASON_4,
  ]);

export const SEASON_NUM_TO_CHALLENGE = {
  1: ChallengeCustom.SEASON_1,
  2: ChallengeCustom.SEASON_2,
  3: ChallengeCustom.SEASON_3,
  4: ChallengeCustom.SEASON_4,
} as const;
