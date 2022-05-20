import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import * as buttons from "../buttons";

export function changeCharOrderPostPressurePlateUpdate(
  pressurePlate: GridEntityPressurePlate,
): void {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.CHANGE_CHAR_ORDER) {
    return;
  }

  buttons.postPressurePlateUpdate(pressurePlate);
}
