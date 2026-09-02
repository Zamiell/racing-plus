import type { PickupVariant } from "isaac-typescript-definitions";
import { validateCustomEnum } from "isaacscript-common";

/** For `EntityType.PICKUP` (5). */
export const PickupVariantCustom = {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  INVISIBLE_PICKUP: Isaac.GetEntityVariantByName(
    "Invisible Pickup",
  ) as PickupVariant,
} as const;

validateCustomEnum("PickupVariantCustom", PickupVariantCustom);
