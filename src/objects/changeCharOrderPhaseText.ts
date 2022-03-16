import { ChangeCharOrderPhase } from "../enums/ChangeCharOrderPhase";

export const CHANGE_CHAR_ORDER_PHASE_TEXT: {
  readonly [key in ChangeCharOrderPhase]: string;
} = {
  [ChangeCharOrderPhase.SEASON_SELECT]: "Choose your season",
  [ChangeCharOrderPhase.CHARACTER_SELECT]: "Choose your character order",
  [ChangeCharOrderPhase.BUILD_VETO]: "Choose your build vetos",
};
