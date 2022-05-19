import { validateCustomEnum } from "isaacscript-common";

// EntityType.PICKUP (5)
export const PickupVariantCustom = {
  INVISIBLE_PICKUP: Isaac.GetEntityVariantByName("Invisible Pickup"),
} as const;

validateCustomEnum("PickupVariantCustom", PickupVariantCustom);
