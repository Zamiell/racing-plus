export const ChallengeCustom = {
  SEASON_1: Isaac.GetChallengeIdByName("R+7 Season 1"),
  SEASON_2: Isaac.GetChallengeIdByName("R+7 Season 2"),
  SEASON_3: Isaac.GetChallengeIdByName("R+7 Season 3"),
  SEASON_4: Isaac.GetChallengeIdByName("R+7 Season 4 Beta"),
  CHANGE_CHAR_ORDER: Isaac.GetChallengeIdByName("Change Char Order"),
} as const;

/** We don't use the `validateCustomEnum` helper function since some seasons can be in beta. */
// validateCustomEnum("ChallengeCustom", ChallengeCustom);
