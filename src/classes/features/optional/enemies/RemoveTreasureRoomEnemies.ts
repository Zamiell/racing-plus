import { EntityType, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getNPCs,
  ModCallbackCustom,
  ReadonlySet,
  setRoomCleared,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const ENTITY_TYPES_EXEMPT_FROM_REMOVAL = new ReadonlySet<EntityType>([
  EntityType.ETERNAL_FLY,
  EntityType.DARK_ESAU,
]);

export class RemoveTreasureRoomEnemies extends ConfigurableModFeature {
  configKey: keyof Config = "RemoveTreasureRoomEnemies";

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, RoomType.TREASURE)
  postNewRoomReorderedTreasure(): void {
    this.removeTreasureRoomEnemies();
  }

  removeTreasureRoomEnemies(): void {
    for (const npc of getNPCs()) {
      if (!ENTITY_TYPES_EXEMPT_FROM_REMOVAL.has(npc.Type)) {
        npc.Remove();
      }
    }

    setRoomCleared();
  }
}
