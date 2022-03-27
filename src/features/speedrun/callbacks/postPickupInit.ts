import { spawnPickup } from "isaacscript-common";
import { inSpeedrun } from "../speedrun";

export function trophy(pickup: EntityPickup): void {
  if (!inSpeedrun()) {
    return;
  }

  removeAndSpawnBigChest(pickup);
}

function removeAndSpawnBigChest(pickup: EntityPickup) {
  // Funnel all end-of-run decision making through code that runs on PostPickupInit for Big Chests
  pickup.Remove();
  spawnPickup(PickupVariant.PICKUP_BIGCHEST, 0, pickup.Position);
}
