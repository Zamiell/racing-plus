import type { EffectVariant } from "isaac-typescript-definitions";
import { validateCustomEnum } from "isaacscript-common";

/** For `EntityType.EFFECT` (1000). */
export const EffectVariantCustom = {
  INVISIBLE_EFFECT: Isaac.GetEntityVariantByName(
    "Invisible Effect",
  ) as EffectVariant,
  PITFALL_CUSTOM: Isaac.GetEntityVariantByName(
    "Pitfall (Custom)",
  ) as EffectVariant,
  ROOM_CLEAR_DELAY: Isaac.GetEntityVariantByName(
    "Room Clear Delay Effect",
  ) as EffectVariant,
  STICKY_NICKEL: Isaac.GetEntityVariantByName(
    "Sticky Nickel Effect",
  ) as EffectVariant,
} as const;

validateCustomEnum("EffectVariantCustom", EffectVariantCustom);
