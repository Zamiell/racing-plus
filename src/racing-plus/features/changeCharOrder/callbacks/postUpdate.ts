import { ChallengeCustom } from "../../speedrun/enums";
import * as buttons from "../buttons";

export default function charCharOrderPostUpdate(): void {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.CHANGE_CHAR_ORDER) {
    return;
  }

  buttons.postUpdate();
}
