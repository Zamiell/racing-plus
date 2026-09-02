import type { FamiliarVariant } from "isaac-typescript-definitions";
import { validateCustomEnum } from "isaacscript-common";

/** For `EntityType.FAMILIAR` (3). */
export const FamiliarVariantCustom = {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  SAWBLADE: Isaac.GetEntityVariantByName("Sawblade") as FamiliarVariant,
} as const;

validateCustomEnum("FamiliarVariantCustom", FamiliarVariantCustom);
