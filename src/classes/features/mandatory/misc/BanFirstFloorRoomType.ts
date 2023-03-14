import { RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getDoorsToRoomIndex,
  getPlayers,
  getRoomGridIndexesForType,
  hideRoomOnMinimap,
  inRoomType,
  ModCallbackCustom,
  onFirstFloor,
  removeAllPickups,
  removeDoors,
} from "isaacscript-common";
import { isPlanetariumFixWarping } from "../../../../features/mandatory/planetariumFix";
import { inSeededRace } from "../../../../features/race/v";
import { onSeason } from "../../../../speedrun/utilsSpeedrun";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import { isOnFirstCharacter } from "../../speedrun/characterProgress/v";

const SEASON_2_BANNED_ROOM_TYPES = [
  RoomType.MINI_BOSS, // 6
  RoomType.CURSE, // 10
  RoomType.LIBRARY, // 12
  RoomType.PLANETARIUM, // 24
] as const;

export class BanFirstFloorRoomType extends MandatoryModFeature {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (shouldBanFirstFloorTreasureRoom()) {
      this.checkForRoomType(RoomType.TREASURE);
    }

    if (this.shouldBanSpecialRoomsSeason2()) {
      for (const roomType of SEASON_2_BANNED_ROOM_TYPES) {
        this.checkForRoomType(roomType);
      }
    }
  }

  shouldBanSpecialRoomsSeason2(): boolean {
    return onSeason(2) && onFirstFloor() && isOnFirstCharacter();
  }

  checkForRoomType(bannedRoomType: RoomType): void {
    if (inRoomType(bannedRoomType)) {
      this.inBannedRoom();
    } else {
      this.outsideBannedRoom(bannedRoomType);
    }
  }

  inBannedRoom(): void {
    removeAllPickups();

    if (isPlanetariumFixWarping()) {
      return;
    }

    // Signal that we are not supposed to get the pickups in this room. If they are teleporting into
    // the banned room, the animation will not actually play, but they will still be able to hear
    // the sound effect.
    for (const player of getPlayers()) {
      player.AnimateSad();
    }
  }

  outsideBannedRoom(bannedRoomType: RoomType): void {
    // Delete the doors to the banned room, if any. This includes the doors in a Secret Room. (We
    // must delete the door before changing the minimap, or else the icon will remain.)
    const bannedRoomGridIndexes = getRoomGridIndexesForType(bannedRoomType);
    const doorsToBannedRooms = getDoorsToRoomIndex(...bannedRoomGridIndexes);
    removeDoors(...doorsToBannedRooms);

    // Delete the icon on the minimap. (This has to be done on every room, because it will
    // reappear.)
    for (const roomGridIndex of bannedRoomGridIndexes) {
      hideRoomOnMinimap(roomGridIndex);
    }
  }
}

export function shouldBanFirstFloorTreasureRoom(): boolean {
  return onFirstFloor() && (inSeededRace() || onSeason(2));
}
