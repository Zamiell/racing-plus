import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import * as taintedIsaacCollectibleDelay from "../features/optional/bugfix/taintedIsaacCollectibleDelay";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_PICKUP_UPDATE,
    collectibleCallback,
    PickupVariant.COLLECTIBLE, // 100
  );
}

// PickupVariant.COLLECTIBLE (100)
function collectibleCallback(pickup: EntityPickup) {
  const collectible = pickup as EntityPickupCollectible;

  // Bug fixes
  taintedIsaacCollectibleDelay.postPickupUpdateCollectible(collectible);
}
