import { validateCustomEnum } from "isaacscript-common";

export enum EntityTypeCustom {
  ENTITY_RACE_TROPHY = Isaac.GetEntityTypeByName("Race Trophy"),
}

validateCustomEnum("EntityTypeCustom", EntityTypeCustom);
