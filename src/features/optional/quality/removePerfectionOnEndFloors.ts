import { RoomType, TrinketType } from "isaac-typescript-definitions";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// ModCallback.POST_PICKUP_INIT (34)
// PickupVariant.TRINKET (350)
export function postPickupInitTrinket(pickup: EntityPickup): void {
  if (!config.removePerfectionVelocity) {
    return;
  }

  if (pickup.SubType !== TrinketType.PERFECTION) {
    return;
  }

  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  if (stage >= 11 && roomType === RoomType.BOSS) {
    pickup.Remove();
  }
}
