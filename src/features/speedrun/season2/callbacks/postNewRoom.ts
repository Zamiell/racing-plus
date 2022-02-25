import { getPickups } from "isaacscript-common";
import g from "../../../../globals";
import { getRoomsEntered } from "../../../utils/roomsEntered";
import { ChallengeCustom } from "../../enums";
import { speedrunGetCharacterNum } from "../../exported";
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

  preventResettingForCurseRoom(roomsEntered);
}

function preventResettingForCurseRoom(roomsEntered: int) {
  const characterNum = speedrunGetCharacterNum();
  const roomType = g.r.GetType();

  if (
    characterNum !== 1 ||
    roomType !== RoomType.ROOM_CURSE ||
    roomsEntered !== 2
  ) {
    return;
  }

  const pickups = getPickups();
  for (const pickup of pickups) {
    pickup.Remove();
  }

  const player = Isaac.GetPlayer();
  player.AnimateSad();
}
