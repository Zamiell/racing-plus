import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { getNumRoomsEntered } from "../../../utils/numRoomsEntered";
import { resetSprites } from "../sprites";

export function season2PostNewRoom(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_2) {
    return;
  }

  const roomsEntered = getNumRoomsEntered();

  if (roomsEntered !== 1) {
    resetSprites();
  }
}
