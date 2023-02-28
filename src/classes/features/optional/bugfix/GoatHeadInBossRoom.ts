import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  hasCollectible,
  hasDoorType,
  inRoomType,
  ModCallbackCustom,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class GoatHeadInBossRoom extends ConfigurableModFeature {
  configKey: keyof Config = "GoatHeadInBossRoom";

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    if (!inRoomType(RoomType.BOSS)) {
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

    const room = game.GetRoom();
    room.TrySpawnDevilRoomDoor(true);
  }
}
