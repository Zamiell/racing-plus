import { validateCustomEnum } from "isaacscript-common";

// EntityType.ENTITY_FAMILIAR (3)
export enum FamiliarVariantCustom {
  SAWBLADE = Isaac.GetEntityVariantByName("Sawblade"),
}

validateCustomEnum("FamiliarVariantCustom", FamiliarVariantCustom);
