export const ChallengeCustom = {
  SEASON_1: Isaac.GetChallengeIdByName("R+7 Season 1"),
  SEASON_2: Isaac.GetChallengeIdByName("R+7 Season 2"),
  SEASON_3: Isaac.GetChallengeIdByName("R+7 Season 3 Beta"),
  CHANGE_CHAR_ORDER: Isaac.GetChallengeIdByName("Change Char Order"),
} as const;

// TODO: Uncomment when S3 is in beta.
/// validateCustomEnum("ChallengeCustom", ChallengeCustom);
