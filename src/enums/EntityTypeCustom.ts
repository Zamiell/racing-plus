import { validateCustomEnum } from "isaacscript-common";

export const EntityTypeCustom = {
  ENTITY_RACE_TROPHY: Isaac.GetEntityTypeByName("Race Trophy"),
} as const;

validateCustomEnum("EntityTypeCustom", EntityTypeCustom);
