import { validateCustomEnum } from "isaacscript-common";

// EntityType.ENTITY_PICKUP (5)
export enum PickupVariantCustom {
  INVISIBLE_PICKUP = Isaac.GetEntityVariantByName("Invisible Pickup"),
}

validateCustomEnum("PickupVariantCustom", PickupVariantCustom);
