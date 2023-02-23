// Rarely, Ultra Secret Rooms can have no doors. Work around this by spawning a Fool card for the
// player.

import { CardType, RoomType } from "isaac-typescript-definitions";
import {
  game,
  getDoors,
  gridCoordinatesToWorldPosition,
  spawnCard,
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.PreventUltraSecretRoomSoftlock) {
    return;
  }

  const room = game.GetRoom();
  const roomType = room.GetType();
  if (roomType !== RoomType.ULTRA_SECRET) {
    return;
  }

  const doors = getDoors();
  if (doors.length > 0) {
    return;
  }

  // We need to spawn the card in a spot that won't be blocked. The center of the room can be
  // blocked in one specific Ultra Secret Room. Use the left side of the room instead (which is free
  // in all Ultra Secret Rooms).
  const position = gridCoordinatesToWorldPosition(2, 3);
  spawnCard(CardType.FOOL, position);
}
