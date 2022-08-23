import {
  LevelStage,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import { onRepentanceStage } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// ModCallback.POST_PICKUP_INIT (34)
// PickupVariant.TRINKET (350)
export function postPickupInitTrinket(pickup: EntityPickupTrinket): void {
  if (!config.removePerfectionOnEndFloors) {
    return;
  }

  if (pickup.SubType !== TrinketType.PERFECTION) {
    return;
  }

  const roomType = g.r.GetType();
  if (roomType !== RoomType.BOSS) {
    return;
  }

  const stage = g.l.GetStage();
  if (
    stage >= LevelStage.DARK_ROOM_CHEST ||
    (stage === LevelStage.WOMB_2 && onRepentanceStage())
  ) {
    pickup.Remove();
  }
}
