import {
  getDoorsToRoomIndex,
  getEffectiveStage,
  getPlayers,
  getRoomGridIndexesForType,
  removeAllPickups,
  removeDoors,
} from "isaacscript-common";
import g from "../../globals";
import { inSeededRace } from "../race/v";
import { ChallengeCustom } from "../speedrun/enums";

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (shouldBanFirstFloorTreasureRoom()) {
    postNewRoomCheckForRoomType(RoomType.ROOM_TREASURE);
  } else if (shouldBanFirstFloorCurseRoom()) {
    postNewRoomCheckForRoomType(RoomType.ROOM_CURSE);
  }
}

export function shouldBanFirstFloorTreasureRoom(): boolean {
  const challenge = Isaac.GetChallenge();
  const effectiveStage = getEffectiveStage();

  return (
    effectiveStage === 1 &&
    (inSeededRace() || challenge === ChallengeCustom.SEASON_2)
  );
}

function shouldBanFirstFloorCurseRoom(): boolean {
  const challenge = Isaac.GetChallenge();
  const effectiveStage = getEffectiveStage();

  return effectiveStage === 1 && challenge === ChallengeCustom.SEASON_2;
}

function postNewRoomCheckForRoomType(bannedRoomType: RoomType) {
  const roomType = g.r.GetType();

  if (roomType === bannedRoomType) {
    inBannedRoom();
  } else {
    outsideBannedRoom(bannedRoomType);
  }
}

function inBannedRoom() {
  removeAllPickups();

  // Signal that we are not supposed to get the pickups in this room
  // If they are teleporting into the banned room, the animation will not actually play,
  // but they will still be able to hear the sound effect
  for (const player of getPlayers()) {
    player.AnimateSad();
  }
}

function outsideBannedRoom(bannedRoomType: RoomType) {
  // Delete the doors to the banned room, if any
  // (this includes the doors in a Secret Room)
  // (we must delete the door before changing the minimap, or else the icon will remain)
  const bannedRoomGridIndexes = getRoomGridIndexesForType(bannedRoomType);
  const doorsToBannedRooms = getDoorsToRoomIndex(...bannedRoomGridIndexes);
  removeDoors(...doorsToBannedRooms);

  // Delete the icon on the minimap
  // (this has to be done on every room, because it will reappear)
  if (MinimapAPI === undefined) {
    for (const roomGridIndex of bannedRoomGridIndexes) {
      const roomDesc = g.l.GetRoomByIdx(roomGridIndex);
      roomDesc.DisplayFlags = 0;
    }
  } else {
    for (const roomGridIndex of bannedRoomGridIndexes) {
      const roomDesc = MinimapAPI.GetRoomByIdx(roomGridIndex);
      if (roomDesc !== undefined) {
        roomDesc.Remove();
      }
    }
  }

  g.l.UpdateVisibility(); // Setting the display flag will not actually update the map
}
