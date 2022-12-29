import { Challenge } from "isaac-typescript-definitions";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import { g } from "../../globals";

export const CHALLENGE_DEFINITIONS: ReadonlyMap<
  Challenge,
  [seasonAbbreviation: string, numElements: int]
> = new Map([
  [ChallengeCustom.SEASON_1, ["R7S1", 7]],
  [ChallengeCustom.SEASON_2, ["R7S2", 3]],
  [ChallengeCustom.SEASON_3, ["R7S3", 0]], // There are no choices for Season 3.
  [ChallengeCustom.SEASON_4, ["R7S4", 0]], // There are no choices for Season 4.
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
