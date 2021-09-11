import { getNPCs } from "isaacscript-common";
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

  for (const npc of getNPCs()) {
    if (npc.Type !== EntityType.ENTITY_ETERNALFLY) {
      npc.Remove();
    }
  }

  setRoomCleared();
}
