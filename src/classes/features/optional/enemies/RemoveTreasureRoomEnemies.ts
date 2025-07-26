import { EntityFlag, EntityType, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  ReadonlySet,
  getNPCs,
  setRoomCleared,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const ENTITY_TYPES_EXEMPT_FROM_REMOVAL = new ReadonlySet<EntityType>([
  EntityType.ETERNAL_FLY, // 96
  EntityType.BOMB_GRIMACE, // 809
  EntityType.DARK_ESAU, // 866
]);

export class RemoveTreasureRoomEnemies extends ConfigurableModFeature {
  configKey: keyof Config = "RemoveTreasureRoomEnemies";

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, RoomType.TREASURE)
  postNewRoomReorderedTreasure(): void {
    this.removeTreasureRoomEnemies();
  }

  removeTreasureRoomEnemies(): void {
    for (const npc of getNPCs()) {
      if (
        !ENTITY_TYPES_EXEMPT_FROM_REMOVAL.has(npc.Type)
        && !npc.HasEntityFlags(EntityFlag.FRIENDLY)
      ) {
        npc.Remove();
      }
    }

    setRoomCleared();
  }
}
