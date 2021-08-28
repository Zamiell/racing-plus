import { getNPCs, removeAllEntities } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { setRoomCleared } from "../../../utilGlobals";

export function postNewRoom(): void {
  if (!config.removeTreasureRoomEnemies) {
    return;
  }

  removeTreasureRoomEnemies();
}

function removeTreasureRoomEnemies() {
  const roomType = g.r.GetType();

  if (roomType !== RoomType.ROOM_TREASURE) {
    return;
  }

  const npcs = getNPCs();
  removeAllEntities(npcs);
  setRoomCleared();
}
