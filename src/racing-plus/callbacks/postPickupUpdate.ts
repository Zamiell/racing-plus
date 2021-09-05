import * as preventItemRotate from "../features/mandatory/preventItemRotate";
import * as removeGlitchedItems from "../features/mandatory/removeGlitchedItems";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_PICKUP_UPDATE,
    collectible,
    PickupVariant.PICKUP_COLLECTIBLE, // 100
  );
}

// PickupVariant.PICKUP_COLLECTIBLE (100)
function collectible(pickup: EntityPickup) {
  removeGlitchedItems.postPickupUpdateCollectible(pickup);
  preventItemRotate.postPickupUpdateCollectible(pickup);
}
