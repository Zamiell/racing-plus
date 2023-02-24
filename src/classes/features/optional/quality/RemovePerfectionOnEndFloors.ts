import {
  LevelStage,
  PickupVariant,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  inRoomType,
  ModCallbackCustom,
  onRepentanceStage,
  onStage,
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
    const level = game.GetLevel();

    if (!inRoomType(RoomType.BOSS)) {
      return;
    }

    const stage = level.GetStage();
    if (
      stage >= LevelStage.DARK_ROOM_CHEST ||
      (onStage(LevelStage.WOMB_2) && onRepentanceStage())
    ) {
      pickup.Remove();
    }
  }
}
