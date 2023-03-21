import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  hasCollectible,
  hasDoorType,
  inRoomType,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class GoatHeadInBossRoom extends ConfigurableModFeature {
  configKey: keyof Config = "GoatHeadInBossRoom";

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const room = game.GetRoom();
    const roomClear = room.IsClear();

    if (!inRoomType(RoomType.BOSS)) {
      return;
    }

    if (!roomClear) {
      return;
    }

    if (hasDoorType(RoomType.DEVIL, RoomType.ANGEL)) {
      return;
    }

    if (
      !hasCollectible(
        player,
        CollectibleType.GOAT_HEAD,
        CollectibleType.EUCHARIST,
      )
    ) {
      return;
    }

    room.TrySpawnDevilRoomDoor(true);
  }
}
