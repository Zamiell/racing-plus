import { validateCustomEnum } from "isaacscript-common";

export const EntityTypeCustom = {
  ROOM_CLEAR_DELAY_NPC: Isaac.GetEntityTypeByName("Room Clear Delay NPC"),
} as const;

validateCustomEnum("EntityTypeCustom", EntityTypeCustom);
