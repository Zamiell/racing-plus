import {
  getDoorsToRoomIndex,
  getEffectiveStage,
  getPlayers,
  getRoomGridIndexesForType,
  removeAllCollectibles,
  removeDoors,
} from "isaacscript-common";
import g from "../../globals";
import { inSeededRace } from "../race/v";
import { ChallengeCustom } from "../speedrun/enums";

export function postNewRoom(): void {
  const roomType = g.r.GetType();

  if (!shouldBanFirstFloorTreasureRoom()) {
    return;
  }

  if (roomType === RoomType.ROOM_TREASURE) {
    inTreasureRoom();
  } else {
    outsideTreasureRoom();
  }
}

function inTreasureRoom() {
  removeAllCollectibles();

  // Signal that we are not supposed to get the items in this room
  // If they are teleporting into the Treasure Room, the animation will not actually play,
  // but they will still be able to hear the sound effect
  for (const player of getPlayers()) {
    player.AnimateSad();
  }
}

function outsideTreasureRoom() {
  // Delete the doors to the Basement 1 treasure room, if any
  // (this includes the doors in a Secret Room)
  // (we must delete the door before changing the minimap, or else the icon will remain)
  const treasureRoomGridIndexes = getRoomGridIndexesForType(
    RoomType.ROOM_TREASURE,
  );
  const doorsToTreasureRooms = getDoorsToRoomIndex(...treasureRoomGridIndexes);
  removeDoors(...doorsToTreasureRooms);

  // Delete the icon on the minimap
  // (this has to be done on every room, because it will reappear)
  if (MinimapAPI === undefined) {
    for (const roomGridIndex of treasureRoomGridIndexes) {
      const roomDesc = g.l.GetRoomByIdx(roomGridIndex);
      roomDesc.DisplayFlags = 0;
    }
  } else {
    for (const roomGridIndex of treasureRoomGridIndexes) {
      const roomDesc = MinimapAPI.GetRoomByIdx(roomGridIndex);
      if (roomDesc !== undefined) {
        roomDesc.Remove();
      }
    }
  }

  g.l.UpdateVisibility(); // Setting the display flag will not actually update the map
}

export function shouldBanFirstFloorTreasureRoom(): boolean {
  const challenge = Isaac.GetChallenge();
  const effectiveStage = getEffectiveStage();

  return (
    effectiveStage === 1 &&
    (inSeededRace() || challenge === ChallengeCustom.SEASON_2)
  );
}
