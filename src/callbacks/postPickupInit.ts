import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { PickupVariantCustom } from "../enums/PickupVariantCustom";
import * as fastTravelPostPickupInit from "../features/optional/major/fastTravel/callbacks/postPickupInit";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    bigChest,
    PickupVariant.BIG_CHEST, // 340
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    invisiblePickup,
    PickupVariantCustom.INVISIBLE_PICKUP,
  );
}

// PickupVariant.BIG_CHEST (340)
function bigChest(pickup: EntityPickup) {
  fastTravelPostPickupInit.bigChest(pickup);
}

// PickupVariantCustom.INVISIBLE_PICKUP
function invisiblePickup(pickup: EntityPickup) {
  pickup.Remove();
}
