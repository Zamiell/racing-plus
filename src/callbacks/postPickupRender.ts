import * as flipCustom from "../features/items/flipCustom";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";

export function init(mod: Mod) {
  mod.AddCallback(
    ModCallbacks.MC_POST_PICKUP_RENDER,
    collectible,
    PickupVariant.PICKUP_COLLECTIBLE, // 100
  );
}

function collectible(pickup: EntityPickup, renderOffset: Vector) {
  freeDevilItem.postPickupRenderCollectible(pickup, renderOffset);
  flipCustom.postPickupRenderCollectible(pickup, renderOffset);
}
