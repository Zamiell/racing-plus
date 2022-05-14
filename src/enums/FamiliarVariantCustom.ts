import { validateCustomEnum } from "isaacscript-common";

// EntityType.FAMILIAR (3)
export enum FamiliarVariantCustom {
  SAWBLADE = Isaac.GetEntityVariantByName("Sawblade"),
}

validateCustomEnum("FamiliarVariantCustom", FamiliarVariantCustom);
