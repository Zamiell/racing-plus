// Rarely, Ultra Secret Rooms can have no doors
// Work around this by spawning a Fool card for the player

import { getDoors, gridToPos } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.preventUltraSecretRoomSoftlock) {
    return;
  }

  const roomType = g.r.GetType();
  if (roomType !== RoomType.ROOM_ULTRASECRET) {
    return;
  }

  const doors = getDoors();
  if (doors.length > 0) {
    return;
  }

  // We need to spawn the card in a spot that won't be blocked
  // The center of the room can be blocked in one specific Ultra Secret Room
  // Use the left side of the room instead (which is free in all Ultra Secret Rooms)
  const position = gridToPos(2, 3);
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.CARD_FOOL,
    position,
    Vector.Zero,
    undefined,
  );
}
