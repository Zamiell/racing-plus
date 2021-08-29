import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import { PickupVariantCustom } from "../types/enums";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_PICKUP_RENDER,
    invisiblePickup,
    PickupVariantCustom.INVISIBLE_PICKUP,
  );
}

function invisiblePickup(pickup: EntityPickup) {
  chargePocketItemFirst.postPickupRenderInvisiblePickup(pickup);
}
