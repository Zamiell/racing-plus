// EntityType.ENTITY_PICKUP (5)
// PickupVariant.PICKUP_COLLECTIBLE (100)
export enum CollectibleTypeCustom {
  // Utility items
  COLLECTIBLE_TROPHY = Isaac.GetItemIdByName("Trophy"),
  COLLECTIBLE_CHECKPOINT = Isaac.GetItemIdByName("Checkpoint"),
  COLLECTIBLE_RESET = Isaac.GetItemIdByName("Reset"),
  COLLECTIBLE_DEBUG = Isaac.GetItemIdByName("Debug"),

  // Custom items
  COLLECTIBLE_SAWBLADE = Isaac.GetItemIdByName("Sawblade"),
  COLLECTIBLE_13_LUCK = Isaac.GetItemIdByName("13 Luck"),
  COLLECTIBLE_15_LUCK = Isaac.GetItemIdByName("15 Luck"),

  // Vanilla replacements
  COLLECTIBLE_3_DOLLAR_BILL_SEEDED = Isaac.GetItemIdByName(
    "3 Dollar Bill (Seeded)",
  ),
  COLLECTIBLE_MAGIC_8_BALL_SEEDED = Isaac.GetItemIdByName(
    "Magic 8 Ball (Seeded)",
  ),
  COLLECTIBLE_FLIP_CUSTOM = Isaac.GetItemIdByName("Flip (Custom)"),

  // Starting item placeholders
  COLLECTIBLE_MAGIC_MUSHROOM_PLACEHOLDER = Isaac.GetItemIdByName(
    "Magic Mushroom Placeholder",
  ),
  COLLECTIBLE_SACRED_HEART_PLACEHOLDER = Isaac.GetItemIdByName(
    "Sacred Heart Placeholder",
  ),
  COLLECTIBLE_DEATHS_TOUCH_PLACEHOLDER = Isaac.GetItemIdByName(
    "Death's Touch Placeholder",
  ),
  COLLECTIBLE_JUDAS_SHADOW_PLACEHOLDER = Isaac.GetItemIdByName(
    "Judas' Shadow Placeholder",
  ),
  COLLECTIBLE_GODHEAD_PLACEHOLDER = Isaac.GetItemIdByName(
    "Godhead Placeholder",
  ),
  COLLECTIBLE_INCUBUS_PLACEHOLDER = Isaac.GetItemIdByName(
    "Incubus Placeholder",
  ),
  COLLECTIBLE_MAW_OF_THE_VOID_PLACEHOLDER = Isaac.GetItemIdByName(
    "Maw of the Void Placeholder",
  ),
  COLLECTIBLE_CROWN_OF_LIGHT_PLACEHOLDER = Isaac.GetItemIdByName(
    "Crown of Light Placeholder",
  ),
  COLLECTIBLE_TWISTED_PAIR_PLACEHOLDER = Isaac.GetItemIdByName(
    "Twisted Pair Placeholder",
  ),

  // Transformation helpers
  COLLECTIBLE_GUPPY_TRANSFORMATION_HELPER = Isaac.GetItemIdByName(
    "Guppy Transformation Helper",
  ),
  COLLECTIBLE_BEELZEBUB_TRANSFORMATION_HELPER = Isaac.GetItemIdByName(
    "Beelzebub Transformation Helper",
  ),
  COLLECTIBLE_FUN_GUY_TRANSFORMATION_HELPER = Isaac.GetItemIdByName(
    "Fun Guy Transformation Helper",
  ),
  COLLECTIBLE_SERAPHIM_TRANSFORMATION_HELPER = Isaac.GetItemIdByName(
    "Seraphim Transformation Helper",
  ),
  COLLECTIBLE_BOB_TRANSFORMATION_HELPER = Isaac.GetItemIdByName(
    "Bob Transformation Helper",
  ),
  COLLECTIBLE_SPUN_TRANSFORMATION_HELPER = Isaac.GetItemIdByName(
    "Spun Transformation Helper",
  ),
  COLLECTIBLE_YES_MOTHER_TRANSFORMATION_HELPER = Isaac.GetItemIdByName(
    "Yes Mother Transformation Helper",
  ),
  COLLECTIBLE_CONJOINED_TRANSFORMATION_HELPER = Isaac.GetItemIdByName(
    "Conjoined Transformation Helper",
  ),
  COLLECTIBLE_LEVIATHAN_TRANSFORMATION_HELPER = Isaac.GetItemIdByName(
    "Leviathan Transformation Helper",
  ),
  COLLECTIBLE_OH_CRAP_TRANSFORMATION_HELPER = Isaac.GetItemIdByName(
    "Oh Crap Transformation Helper",
  ),
  COLLECTIBLE_BOOKWORM_TRANSFORMATION_HELPER = Isaac.GetItemIdByName(
    "Bookworm Transformation Helper",
  ),
  COLLECTIBLE_SPIDER_BABY_TRANSFORMATION_HELPER = Isaac.GetItemIdByName(
    "Spider Baby Transformation Helper",
  ),
}
