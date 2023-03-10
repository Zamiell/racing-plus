import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { PickupVariantCustom } from "../../../../enums/PickupVariantCustom";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

export class InvisiblePickup extends MandatoryModFeature {
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariantCustom.INVISIBLE_PICKUP)
  postPickupInitInvisiblePickup(pickup: EntityPickup): void {
    pickup.Remove();
  }
}
