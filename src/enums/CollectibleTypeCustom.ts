// EntityType.PICKUP (5)

import { validateCustomEnum } from "isaacscript-common";

// PickupVariant.COLLECTIBLE (100)
export const CollectibleTypeCustom = {
  // Utility items
  TROPHY: Isaac.GetItemIdByName("Trophy"),
  CHECKPOINT: Isaac.GetItemIdByName("Checkpoint"),
  RESET: Isaac.GetItemIdByName("Reset"),
  DEBUG: Isaac.GetItemIdByName("Debug"),

  // Custom items
  SAWBLADE: Isaac.GetItemIdByName("Sawblade"),
  THIRTEEN_LUCK: Isaac.GetItemIdByName("13 Luck"),
  FIFTEEN_LUCK: Isaac.GetItemIdByName("15 Luck"),

  // Vanilla replacements
  THREE_DOLLAR_BILL_SEEDED: Isaac.GetItemIdByName("3 Dollar Bill (Seeded)"),
  MAGIC_8_BALL_SEEDED: Isaac.GetItemIdByName("Magic 8 Ball (Seeded)"),
  FLIP_CUSTOM: Isaac.GetItemIdByName("Flip (Custom)"),

  // Starting item placeholders
  MAGIC_MUSHROOM_PLACEHOLDER: Isaac.GetItemIdByName(
    "Magic Mushroom Placeholder",
  ),
  SACRED_HEART_PLACEHOLDER: Isaac.GetItemIdByName("Sacred Heart Placeholder"),
  DEATHS_TOUCH_PLACEHOLDER: Isaac.GetItemIdByName("Death's Touch Placeholder"),
  JUDAS_SHADOW_PLACEHOLDER: Isaac.GetItemIdByName("Judas' Shadow Placeholder"),
  GODHEAD_PLACEHOLDER: Isaac.GetItemIdByName("Godhead Placeholder"),
  INCUBUS_PLACEHOLDER: Isaac.GetItemIdByName("Incubus Placeholder"),
  MAW_OF_THE_VOID_PLACEHOLDER: Isaac.GetItemIdByName(
    "Maw of the Void Placeholder",
  ),
  CROWN_OF_LIGHT_PLACEHOLDER: Isaac.GetItemIdByName(
    "Crown of Light Placeholder",
  ),
  TWISTED_PAIR_PLACEHOLDER: Isaac.GetItemIdByName("Twisted Pair Placeholder"),

  // Transformation helpers
  GUPPY_TRANSFORMATION_HELPER: Isaac.GetItemIdByName(
    "Guppy Transformation Helper",
  ),
  BEELZEBUB_TRANSFORMATION_HELPER: Isaac.GetItemIdByName(
    "Beelzebub Transformation Helper",
  ),
  FUN_GUY_TRANSFORMATION_HELPER: Isaac.GetItemIdByName(
    "Fun Guy Transformation Helper",
  ),
  SERAPHIM_TRANSFORMATION_HELPER: Isaac.GetItemIdByName(
    "Seraphim Transformation Helper",
  ),
  BOB_TRANSFORMATION_HELPER: Isaac.GetItemIdByName("Bob Transformation Helper"),
  SPUN_TRANSFORMATION_HELPER: Isaac.GetItemIdByName(
    "Spun Transformation Helper",
  ),
  YES_MOTHER_TRANSFORMATION_HELPER: Isaac.GetItemIdByName(
    "Yes Mother Transformation Helper",
  ),
  CONJOINED_TRANSFORMATION_HELPER: Isaac.GetItemIdByName(
    "Conjoined Transformation Helper",
  ),
  LEVIATHAN_TRANSFORMATION_HELPER: Isaac.GetItemIdByName(
    "Leviathan Transformation Helper",
  ),
  OH_CRAP_TRANSFORMATION_HELPER: Isaac.GetItemIdByName(
    "Oh Crap Transformation Helper",
  ),
  BOOKWORM_TRANSFORMATION_HELPER: Isaac.GetItemIdByName(
    "Bookworm Transformation Helper",
  ),
  SPIDER_BABY_TRANSFORMATION_HELPER: Isaac.GetItemIdByName(
    "Spider Baby Transformation Helper",
  ),
} as const;

validateCustomEnum("CollectibleTypeCustom", CollectibleTypeCustom);
