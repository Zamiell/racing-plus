import {
  emptyArray,
  emptyRoom,
  getPlayerFromIndex,
  getRoomListIndex,
  inAngelShop,
} from "isaacscript-common";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import { angel } from "../angel";
import { devil } from "../devil";
import v from "../v";

export function betterDevilAngelRoomsPostNewRoom(): void {
  if (!config.betterDevilAngelRooms) {
    return;
  }

  checkDevilAngelRoomReplacement();
  checkRegiveGuppysEye();
}

function checkDevilAngelRoomReplacement() {
  const roomType = g.r.GetType();
  const isFirstVisit = g.r.IsFirstVisit();

  if (!isFirstVisit) {
    return;
  }

  if (
    roomType !== RoomType.ROOM_DEVIL && // 14
    roomType !== RoomType.ROOM_ANGEL // 15
  ) {
    return;
  }

  // Angel shops do not need to be seeded
  if (inAngelShop()) {
    return;
  }

  if (v.run.intentionallyLeaveEmpty) {
    v.run.intentionallyLeaveEmpty = false;
    emptyRoom(true);
    return;
  }

  v.level.vanillaCollectiblesHaveSpawnedInCustomRoom = true;

  if (roomType === RoomType.ROOM_DEVIL) {
    devil();
  } else if (roomType === RoomType.ROOM_ANGEL) {
    angel();
  }
}

function checkRegiveGuppysEye() {
  if (v.run.regiveGuppysEyePlayers.length === 0) {
    return;
  }

  // Wait until we switch rooms before giving back the Guppy's Eye that we took away
  const roomListIndex = getRoomListIndex();
  if (roomListIndex === v.run.regiveGuppysEyeRoomListIndex) {
    return;
  }

  for (const playerIndex of v.run.regiveGuppysEyePlayers) {
    const player = getPlayerFromIndex(playerIndex);
    if (player !== undefined) {
      player.AddCollectible(CollectibleType.COLLECTIBLE_GUPPYS_EYE, 0, false);
    }
  }

  emptyArray(v.run.regiveGuppysEyePlayers);
  v.run.regiveGuppysEyeRoomListIndex = null;
}
