import { getNPCs, setRoomCleared } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

const ENTITY_TYPES_EXEMPT_FROM_REMOVAL = new Set([
  EntityType.ENTITY_ETERNALFLY,
  EntityType.ENTITY_DARK_ESAU,
]);

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
    if (!ENTITY_TYPES_EXEMPT_FROM_REMOVAL.has(npc.Type)) {
      npc.Remove();
    }
  }

  setRoomCleared();
}
