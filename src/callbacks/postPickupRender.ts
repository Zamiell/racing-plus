import * as flipCustom from "../features/items/flipCustom";

export function init(mod: Mod) {
  mod.AddCallback(
    ModCallbacks.MC_POST_PICKUP_RENDER,
    collectible,
    PickupVariant.PICKUP_COLLECTIBLE, // 100
  );
}

function collectible(pickup: EntityPickup, renderOffset: Vector) {
  flipCustom.postPickupRenderCollectible(pickup, renderOffset);
}
