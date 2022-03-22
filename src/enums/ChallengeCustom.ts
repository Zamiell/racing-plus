import { validateCustomEnum } from "isaacscript-common";

export enum ChallengeCustom {
  SEASON_1 = Isaac.GetChallengeIdByName("R+7 Season 1"),
  SEASON_2 = Isaac.GetChallengeIdByName("R+7 Season 2"),
  CHANGE_CHAR_ORDER = Isaac.GetChallengeIdByName("Change Char Order"),
}

validateCustomEnum("ChallengeCustom", ChallengeCustom);
