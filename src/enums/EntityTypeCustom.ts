import { validateCustomEnum } from "isaacscript-common";

export const EntityTypeCustom = {
  ROOM_CLEAR_DELAY_NPC: Isaac.GetEntityTypeByName("Room Clear Delay NPC"),
  TROPHY_CUSTOM: Isaac.GetEntityTypeByName("Trophy (Custom)"),
} as const;

validateCustomEnum("EntityTypeCustom", EntityTypeCustom);
