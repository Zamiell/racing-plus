import { ChallengeCustom } from "../../../../types/ChallengeCustom";
import { getRoomsEntered } from "../../../utils/roomsEntered";
import { resetSprites } from "../sprites";

export function season2PostNewRoom(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_2) {
    return;
  }

  const roomsEntered = getRoomsEntered();

  if (roomsEntered !== 1) {
    resetSprites();
  }
}
