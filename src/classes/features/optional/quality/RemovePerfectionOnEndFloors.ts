import {
  LevelStage,
  PickupVariant,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  inRoomType,
  ModCallbackCustom,
  onRepentanceStage,
  onStage,
  onStageOrHigher,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class RemovePerfectionOnEndFloors extends ConfigurableModFeature {
  configKey: keyof Config = "RemovePerfectionOnEndFloors";

  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_INIT_FILTER,
    PickupVariant.TRINKET,
    TrinketType.PERFECTION,
  )
  postPickupInitPerfection(pickup: EntityPickup): void {
    if (!inRoomType(RoomType.BOSS)) {
      return;
    }

    if (
      onStageOrHigher(LevelStage.DARK_ROOM_CHEST) ||
      (onStage(LevelStage.WOMB_2) && onRepentanceStage())
    ) {
      pickup.Remove();
    }
  }
}
