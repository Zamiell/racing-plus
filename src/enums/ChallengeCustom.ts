import { validateCustomEnum } from "isaacscript-common";

export const ChallengeCustom = {
  SEASON_1: Isaac.GetChallengeIdByName("R+7 Season 1"),
  SEASON_2: Isaac.GetChallengeIdByName("R+7 Season 2"),
  SEASON_3: Isaac.GetChallengeIdByName("R+7 Season 3"),
  SEASON_4: Isaac.GetChallengeIdByName("R+7 Season 4"),
  CHANGE_CHAR_ORDER: Isaac.GetChallengeIdByName("Change Char Order"),
} as const;

/** Comment out this check if a season is in alpha. */
validateCustomEnum("ChallengeCustom", ChallengeCustom);
