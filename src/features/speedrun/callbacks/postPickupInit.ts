import { PickupVariant } from "isaac-typescript-definitions";
import { spawnPickup } from "isaacscript-common";
import { inSpeedrun } from "../speedrun";

export function trophy(pickup: EntityPickup): void {
  if (!inSpeedrun()) {
    return;
  }

  removeAndSpawnBigChest(pickup);
}

function removeAndSpawnBigChest(pickup: EntityPickup) {
  // Funnel all end-of-run decision making through code that runs on PostPickupInit for Big Chests.
  pickup.Remove();
  spawnPickup(PickupVariant.BIG_CHEST, 0, pickup.Position);
}
