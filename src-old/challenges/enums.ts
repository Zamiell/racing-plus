export const R7_SEASON_1_NAME = "R+7 (Season 1)";
export const CHANGE_CHAR_ORDER_NAME = "Change Char Order";

export enum ChallengeCustom {
  R9_SEASON_1 = Isaac.GetChallengeIdByName(R9_SEASON_1_NAME),
  CHANGE_CHAR_ORDER = Isaac.GetChallengeIdByName(CHANGE_CHAR_ORDER_NAME),
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
