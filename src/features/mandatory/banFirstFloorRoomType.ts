import { DisplayFlagZero, RoomType } from "isaac-typescript-definitions";
import {
  getDoorsToRoomIndex,
  getEffectiveStage,
  getPlayers,
  getRoomGridIndexesForType,
  removeAllPickups,
  removeDoors,
} from "isaacscript-common";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import g from "../../globals";
import { inSeededRace } from "../race/v";
import { isOnFirstCharacter } from "../speedrun/speedrun";
import { isPlanetariumFixWarping } from "./planetariumFix";

const SEASON_2_BANNED_ROOM_TYPES: readonly RoomType[] = [
  RoomType.MINI_BOSS, // 6
  RoomType.CURSE, // 10
  RoomType.LIBRARY, // 12
  RoomType.PLANETARIUM, // 24
];

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (shouldBanFirstFloorTreasureRoom()) {
    postNewRoomCheckForRoomType(RoomType.TREASURE);
  }

  if (shouldBanSpecialRoomsSeason2()) {
    for (const roomType of SEASON_2_BANNED_ROOM_TYPES) {
      postNewRoomCheckForRoomType(roomType);
    }
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

function shouldBanSpecialRoomsSeason2() {
  const challenge = Isaac.GetChallenge();
  const effectiveStage = getEffectiveStage();

  return (
    effectiveStage === 1 &&
    challenge === ChallengeCustom.SEASON_2 &&
    isOnFirstCharacter()
  );
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

  if (isPlanetariumFixWarping()) {
    return;
  }

  // Signal that we are not supposed to get the pickups in this room. If they are teleporting into
  // the banned room, the animation will not actually play, but they will still be able to hear the
  // sound effect.
  for (const player of getPlayers()) {
    player.AnimateSad();
  }
}

function outsideBannedRoom(bannedRoomType: RoomType) {
  // Delete the doors to the banned room, if any. This includes the doors in a Secret Room. (We must
  // delete the door before changing the minimap, or else the icon will remain.)
  const bannedRoomGridIndexes = getRoomGridIndexesForType(bannedRoomType);
  const doorsToBannedRooms = getDoorsToRoomIndex(...bannedRoomGridIndexes);
  removeDoors(...doorsToBannedRooms);

  // Delete the icon on the minimap. (This has to be done on every room, because it will reappear.)
  if (MinimapAPI === undefined) {
    for (const roomGridIndex of bannedRoomGridIndexes) {
      const roomDesc = g.l.GetRoomByIdx(roomGridIndex);
      roomDesc.DisplayFlags = DisplayFlagZero;
    }
  } else {
    for (const roomGridIndex of bannedRoomGridIndexes) {
      const roomDesc = MinimapAPI.GetRoomByIdx(roomGridIndex);
      if (roomDesc !== undefined) {
        roomDesc.Remove();
      }
    }
  }

  // Setting the display flag will not actually update the map.
  g.l.UpdateVisibility();
}
