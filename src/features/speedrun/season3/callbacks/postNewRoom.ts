import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { getNumRoomsEntered } from "../../../utils/numRoomsEntered";
import { resetSeason3StartingRoomSprites } from "../startingRoomSprites";

export function season3PostNewRoom(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  const numRoomsEntered = getNumRoomsEntered();

  if (numRoomsEntered !== 1) {
    resetSeason3StartingRoomSprites();
  }
}
