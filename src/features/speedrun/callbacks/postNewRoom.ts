import { getPlayers } from "isaacscript-common";
import g from "../../../globals";
import { removeAllCollectibles } from "../../../util";
import { setDevilAngelEmpty } from "../../optional/major/betterDevilAngelRooms/v";
import * as season1 from "../season1";
import { inSpeedrun, isOnFirstCharacter } from "../speedrun";
import v from "../v";

export default function speedrunPostNewRoom(): void {
  if (!inSpeedrun()) {
    return;
  }

  checkFirstCharacterFirstFloorDevilRoom();
  season1.postNewRoom();
}

function checkFirstCharacterFirstFloorDevilRoom() {
  // Prevent players from resetting for a Devil Room item on the first character
  if (!isOnFirstCharacter()) {
    return;
  }

  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  if (stage !== 1) {
    return;
  }

  if (
    (roomType === RoomType.ROOM_DEVIL || roomType === RoomType.ROOM_ANGEL) &&
    v.level.previousRoomType === RoomType.ROOM_CURSE
  ) {
    emptyDevilAngelRoom();

    // Later on in this callback, the Devil Room or Angel Room will be replaced with a seeded
    // version of the room
    // Notify the seeded rooms feature to keep the room empty
    setDevilAngelEmpty();
  }

  v.level.previousRoomType = roomType;
}

function emptyDevilAngelRoom() {
  removeAllCollectibles();

  // Signal that we are not supposed to get the items in this room
  // If they are teleporting into the Treasure Room, the animation will not actually play,
  // but they will still be able to hear the sound effect
  for (const player of getPlayers()) {
    player.AnimateSad();
  }
}
