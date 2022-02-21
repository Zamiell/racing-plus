import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_POST_PICKUP_INIT (34)
// PickupVariant.PICKUP_TRINKET (350)
export function postPickupInitTrinket(pickup: EntityPickup): void {
  if (!config.removePerfectionVelocity) {
    return;
  }

  if (pickup.SubType !== TrinketType.TRINKET_PERFECTION) {
    return;
  }

  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  if (stage >= 11 && roomType === RoomType.ROOM_BOSS) {
    pickup.Remove();
  }
}
