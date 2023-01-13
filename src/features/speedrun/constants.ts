import { Challenge } from "isaac-typescript-definitions";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import { g } from "../../globals";

export enum ChallengeCustomAbbreviation {
  SEASON_1 = "R7S1",
  SEASON_2 = "R7S2",
  SEASON_3 = "R7S3",
  SEASON_4 = "R7S4",
}

export const CHALLENGE_DEFINITIONS: ReadonlyMap<
  Challenge,
  [challengeCustomAbbreviation: ChallengeCustomAbbreviation, numElements: int]
> = new Map([
  [ChallengeCustom.SEASON_1, [ChallengeCustomAbbreviation.SEASON_1, 7]],
  [ChallengeCustom.SEASON_2, [ChallengeCustomAbbreviation.SEASON_2, 3]],
  [ChallengeCustom.SEASON_3, [ChallengeCustomAbbreviation.SEASON_3, 0]], // There are no choices for Season 3.
  [ChallengeCustom.SEASON_4, [ChallengeCustomAbbreviation.SEASON_4, 0]], // There are no choices for Season 4.
]);

export const CUSTOM_CHALLENGES_SET: ReadonlySet<Challenge> = new Set(
  CHALLENGE_DEFINITIONS.keys(),
);

/** How long the randomly-selected character and/or build combination is "locked-in". */
const RANDOM_CHARACTER_SELECTION_LOCK_MINUTES = g.debug ? 0.01 : 1.25;
export const RANDOM_CHARACTER_LOCK_SECONDS =
  RANDOM_CHARACTER_SELECTION_LOCK_MINUTES * 60;
export const RANDOM_CHARACTER_LOCK_MILLISECONDS =
  RANDOM_CHARACTER_LOCK_SECONDS * 1000;
