import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { EffectVariantCustom } from "../../../../enums/EffectVariantCustom";
import { PickupVariantCustom } from "../../../../enums/PickupVariantCustom";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

/**
 * The `PRE_ENTITY_SPAWN` callback does not allow removing entities, so we replace entities with
 * invisible versions as a workaround, and then immediately remove them upon spawning.
 */
export class InvisibleEntities extends MandatoryModFeature {
  // 34
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariantCustom.INVISIBLE_PICKUP)
  postPickupInitInvisiblePickup(pickup: EntityPickup): void {
    pickup.Remove();
  }

  // 54
  @Callback(ModCallback.POST_EFFECT_INIT, EffectVariantCustom.INVISIBLE_EFFECT)
  postEffectInitInvisibleEffect(effect: EntityEffect): void {
    effect.Remove();
  }
}
