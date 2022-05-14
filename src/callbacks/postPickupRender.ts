import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import * as flipCustom from "../features/items/flipCustom";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.POST_PICKUP_RENDER,
    collectible,
    PickupVariant.COLLECTIBLE, // 100
  );
}

function collectible(pickup: EntityPickup, renderOffset: Vector) {
  freeDevilItem.postPickupRenderCollectible(pickup, renderOffset);
  flipCustom.postPickupRenderCollectible(pickup, renderOffset);
}
