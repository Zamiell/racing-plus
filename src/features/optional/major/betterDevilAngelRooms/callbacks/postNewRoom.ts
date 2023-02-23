import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import {
  emptyArray,
  emptyRoom,
  game,
  getPlayerFromIndex,
  getRoomListIndex,
  inAngelShop,
  inRoomType,
} from "isaacscript-common";
import { mod } from "../../../../../mod";
import { config } from "../../../../../modConfigMenu";
import { angel } from "../angel";
import { checkRespawnKrampus, devil } from "../devil";
import { v } from "../v";

export function betterDevilAngelRoomsPostNewRoom(): void {
  if (!config.BetterDevilAngelRooms) {
    return;
  }

  checkDevilAngelRoomReplacement();
  checkRegiveGuppysEye();
}

function checkDevilAngelRoomReplacement() {
  const room = game.GetRoom();
  const roomType = room.GetType();
  const isFirstVisit = room.IsFirstVisit();

  if (!isFirstVisit) {
    checkRespawnKrampus();
    return;
  }

  if (!inRoomType(RoomType.DEVIL, RoomType.ANGEL)) {
    return;
  }

  // Angel shops do not need to be seeded.
  if (inAngelShop()) {
    return;
  }

  if (v.run.intentionallyLeaveEmpty) {
    v.run.intentionallyLeaveEmpty = false;
    emptyRoom();
    mod.preventGridEntityRespawn();
    return;
  }

  v.level.vanillaCollectiblesHaveSpawnedInCustomRoom = true;

  if (roomType === RoomType.DEVIL) {
    devil();
  } else {
    angel();
  }
}

function checkRegiveGuppysEye() {
  if (v.run.regiveGuppysEyePlayers.length === 0) {
    return;
  }

  // Wait until we switch rooms before giving back the Guppy's Eye that we took away.
  const roomListIndex = getRoomListIndex();
  if (roomListIndex === v.run.regiveGuppysEyeRoomListIndex) {
    return;
  }

  for (const playerIndex of v.run.regiveGuppysEyePlayers) {
    const player = getPlayerFromIndex(playerIndex);
    if (player !== undefined) {
      player.AddCollectible(CollectibleType.GUPPYS_EYE, 0, false);
    }
  }

  emptyArray(v.run.regiveGuppysEyePlayers);
  v.run.regiveGuppysEyeRoomListIndex = null;
}
