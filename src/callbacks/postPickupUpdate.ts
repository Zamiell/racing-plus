import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import * as removeGlitchedItems from "../features/mandatory/removeGlitchedItems";
import * as taintedIsaacCollectibleDelay from "../features/optional/bugfix/taintedIsaacCollectibleDelay";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.POST_PICKUP_UPDATE,
    collectibleCallback,
    PickupVariant.COLLECTIBLE, // 100
  );
}

// PickupVariant.COLLECTIBLE (100)
function collectibleCallback(pickup: EntityPickup) {
  const collectible = pickup as EntityPickupCollectible;

  // Mandatory
  removeGlitchedItems.postPickupUpdateCollectible(collectible);

  // Major
  freeDevilItem.postPickupUpdateCollectible(collectible);

  // Bug fixes
  taintedIsaacCollectibleDelay.postPickupUpdateCollectible(collectible);
}
