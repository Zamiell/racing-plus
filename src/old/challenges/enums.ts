// TODO remove names? are they needed? do a ctrl+f12 in code after finished
export const R9_SEASON_1_NAME = "R+9 (Season 1)";
export const R14_SEASON_1_NAME = "R+14 (Season 1)";
export const R7_SEASON_2_NAME = "R+7 (Season 2)";
export const R7_SEASON_3_NAME = "R+7 (Season 3)";
export const R7_SEASON_4_NAME = "R+7 (Season 4)";
export const R7_SEASON_5_NAME = "R+7 (Season 5)";
export const R7_SEASON_6_NAME = "R+7 (Season 6)";
export const R7_SEASON_7_NAME = "R+7 (Season 7)";
export const R7_SEASON_8_NAME = "R+7 (Season 8)";
export const R7_SEASON_9_NAME = "R+7 (Season 9 Beta)";
export const R15_VANILLA_NAME = "R+15 (Vanilla)";
export const CHANGE_CHAR_ORDER_NAME = "Change Char Order";
export const CHANGE_KEYBINDINGS_NAME = "Change Keybindings";

export enum ChallengeCustom {
  R9_SEASON_1 = Isaac.GetChallengeIdByName(R9_SEASON_1_NAME),
  R14_SEASON_1 = Isaac.GetChallengeIdByName(R14_SEASON_1_NAME),
  R7_SEASON_2 = Isaac.GetChallengeIdByName(R7_SEASON_2_NAME),
  R7_SEASON_3 = Isaac.GetChallengeIdByName(R7_SEASON_3_NAME),
  R7_SEASON_4 = Isaac.GetChallengeIdByName(R7_SEASON_4_NAME),
  R7_SEASON_5 = Isaac.GetChallengeIdByName(R7_SEASON_5_NAME),
  R7_SEASON_6 = Isaac.GetChallengeIdByName(R7_SEASON_6_NAME),
  R7_SEASON_7 = Isaac.GetChallengeIdByName(R7_SEASON_7_NAME),
  R7_SEASON_8 = Isaac.GetChallengeIdByName(R7_SEASON_8_NAME),
  R7_SEASON_9 = Isaac.GetChallengeIdByName(R7_SEASON_9_NAME),
  R15_VANILLA = Isaac.GetChallengeIdByName(R15_VANILLA_NAME),
  CHANGE_CHAR_ORDER = Isaac.GetChallengeIdByName(CHANGE_CHAR_ORDER_NAME),
  CHANGE_KEYBINDINGS = Isaac.GetChallengeIdByName(CHANGE_KEYBINDINGS_NAME),
}

export enum ChangeCharOrderPhase {
  SEASON_SELECT,
  CHARACTER_SELECT,
  ITEM_SELECT,
  ITEM_SELECT_2,
}

export enum ChangeKeybindingsPhase {
  FAST_DROP,
  FAST_DROP_TRINKET,
  FAST_DROP_POCKET,
  SCHOOLBAG_SWITCH,
  AUTOFIRE,
  START_TO_FADE_OUT,
  FINISHED,
}
