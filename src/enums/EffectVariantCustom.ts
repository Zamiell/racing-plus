import { validateCustomEnum } from "isaacscript-common";

// EntityType.EFFECT (1000)
export const EffectVariantCustom = {
  INVISIBLE_EFFECT: Isaac.GetEntityVariantByName("Invisible Effect"),
  PITFALL_CUSTOM: Isaac.GetEntityVariantByName("Pitfall (Custom)"),
  ROOM_CLEAR_DELAY: Isaac.GetEntityVariantByName("Room Clear Delay Effect"),
  STICKY_NICKEL: Isaac.GetEntityVariantByName("Sticky Nickel Effect"),
} as const;

validateCustomEnum("EffectVariantCustom", EffectVariantCustom);
