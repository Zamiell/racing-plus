import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import * as removeGlitchedItems from "../features/mandatory/removeGlitchedItems";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.POST_PICKUP_UPDATE,
    collectible,
    PickupVariant.COLLECTIBLE, // 100
  );
}

// PickupVariant.COLLECTIBLE (100)
function collectible(pickup: EntityPickup) {
  removeGlitchedItems.postPickupUpdateCollectible(pickup);
  freeDevilItem.postPickupUpdateCollectible(pickup);
}
