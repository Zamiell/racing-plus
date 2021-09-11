import { ChallengeCustom } from "../../speedrun/enums";
import * as buttons from "../buttons";

export function pressurePlate(gridEntity: GridEntity): void {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.CHANGE_CHAR_ORDER) {
    return;
  }

  buttons.postGridEntityUpdatePressurePlate(gridEntity);
}
