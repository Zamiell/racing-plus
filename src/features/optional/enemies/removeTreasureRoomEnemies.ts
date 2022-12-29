import { EntityType, RoomType } from "isaac-typescript-definitions";
import { getNPCs, setRoomCleared } from "isaacscript-common";
import { g } from "../../../globals";
import { config } from "../../../modConfigMenu";

const ENTITY_TYPES_EXEMPT_FROM_REMOVAL: ReadonlySet<EntityType> = new Set([
  EntityType.ETERNAL_FLY,
  EntityType.DARK_ESAU,
]);

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.removeTreasureRoomEnemies) {
    return;
  }

  removeTreasureRoomEnemies();
}

function removeTreasureRoomEnemies() {
  const roomType = g.r.GetType();

  if (roomType !== RoomType.TREASURE) {
    return;
  }

  for (const npc of getNPCs()) {
    if (!ENTITY_TYPES_EXEMPT_FROM_REMOVAL.has(npc.Type)) {
      npc.Remove();
    }
  }

  setRoomCleared();
}
