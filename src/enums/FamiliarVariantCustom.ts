import { validateCustomEnum } from "isaacscript-common";

// EntityType.FAMILIAR (3)
export const FamiliarVariantCustom = {
  SAWBLADE: Isaac.GetEntityVariantByName("Sawblade"),
} as const;

validateCustomEnum("FamiliarVariantCustom", FamiliarVariantCustom);
