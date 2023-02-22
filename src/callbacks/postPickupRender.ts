import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import * as flipCustom from "../features/items/flipCustom";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_PICKUP_RENDER,
    collectible,
    PickupVariant.COLLECTIBLE, // 100
  );
}

function collectible(pickup: EntityPickup, renderOffset: Vector) {
  flipCustom.postPickupRenderCollectible(pickup, renderOffset);
}
