import { inAngelShop } from "isaacscript-common";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";

// On the first visit to the room, remove all of the things in it
export default function betterDevilAngelRoomsPreRoomEntitySpawn(
  entityType: EntityType,
): [int, int, int] | void {
  if (!config.betterDevilAngelRooms) {
    return undefined;
  }

  const roomType = g.r.GetType();
  const roomShape = g.r.GetRoomShape();
  const isFirstVisit = g.r.IsFirstVisit();

  if (
    roomType !== RoomType.ROOM_DEVIL && // 14
    roomType !== RoomType.ROOM_ANGEL // 15
  ) {
    return undefined;
  }

  // Angel shops do not need to be seeded
  if (inAngelShop()) {
    return undefined;
  }

  if (roomShape !== RoomShape.ROOMSHAPE_1x1) {
    error("Seeding non-1x1 rooms is not supported.");
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
