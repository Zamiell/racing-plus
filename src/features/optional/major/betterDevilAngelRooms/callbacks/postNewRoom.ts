import { emptyRoom, inAngelShop } from "isaacscript-common";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import { angel } from "../angel";
import { devil } from "../devil";
import v from "../v";

export function betterDevilAngelRoomsPostNewRoom(): void {
  if (!config.betterDevilAngelRooms) {
    return;
  }

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
