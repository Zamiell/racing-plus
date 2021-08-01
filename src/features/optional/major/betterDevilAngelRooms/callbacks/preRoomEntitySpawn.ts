import g from "../../../../../globals";

// On the first visit to the room, remove all of the everything that spawns in it
export default function betterDevilAngelRoomsPreRoomEntitySpawn(
  entityType: EntityType,
): [int, int, int] | void {
  if (!g.config.betterDevilAngelRooms) {
    return undefined;
  }

  const roomType = g.r.GetType();
  const isFirstVisit = g.r.IsFirstVisit();

  if (
    roomType !== RoomType.ROOM_DEVIL && // 14
    roomType !== RoomType.ROOM_ANGEL // 15
  ) {
    return undefined;
  }

  if (!isFirstVisit) {
    return undefined;
  }

  // If we prevent normal entities (i.e. item pedestals) from spawning,
  // then they will re-appear when the player re-enters the room
  // Thus, we only want to remove grid entities so that they can be replaced with pressure plates
  // (for more information on why we are doing this, see the "fillRoomWithPressurePlates()"
  // function)
  return removeAllGridEntities(entityType);
}

function removeAllGridEntities(entityType: EntityType): [int, int, int] | void {
  if (entityType >= 1000) {
    return [999, 0, 0]; // Equal to 1000.0, which is a blank effect, which is essentially nothing
  }

  return undefined;
}
