export enum EntityTypeCustom {
  ENTITY_RACE_TROPHY = Isaac.GetEntityTypeByName("Race Trophy"),
  ENTITY_ROOM_CLEAR_DELAY_NPC = Isaac.GetEntityTypeByName(
    "Room Clear Delay NPC",
  ),
}

// EntityType.ENTITY_FAMILIAR (3)
export enum FamiliarVariantCustom {
  SAWBLADE = Isaac.GetEntityVariantByName("Sawblade"),
}

// EntityType.ENTITY_PICKUP (5)
export enum PickupVariantCustom {
  INVISIBLE_PICKUP = Isaac.GetEntityVariantByName("Invisible Pickup"),
}

// EntityType.ENTITY_EFFECT (1000)
export enum EffectVariantCustom {
  INVISIBLE_EFFECT = Isaac.GetEntityVariantByName("Invisible Effect"),
  PITFALL_CUSTOM = Isaac.GetEntityVariantByName("Pitfall (Custom)"),
  ROOM_CLEAR_DELAY = Isaac.GetEntityVariantByName("Room Clear Delay Effect"),
}

export enum CollectibleTypeCustom {
  COLLECTIBLE_SAWBLADE = Isaac.GetItemIdByName("Sawblade"),
  COLLECTIBLE_13_LUCK = Isaac.GetItemIdByName("13 Luck"),
  COLLECTIBLE_15_LUCK = Isaac.GetItemIdByName("15 Luck"),

  // Utility items
  COLLECTIBLE_TROPHY = Isaac.GetItemIdByName("Trophy"),
  COLLECTIBLE_CHECKPOINT = Isaac.GetItemIdByName("Checkpoint"),
  COLLECTIBLE_RESET = Isaac.GetItemIdByName("Reset"),
  COLLECTIBLE_DEBUG = Isaac.GetItemIdByName("Debug"),

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

export enum PickupPriceCustom {
  // This can be any arbitrary value as long as it does not conflict with anything in the
  // PickupPrice enum
  PRICE_NO_MINIMAP = -50,
}

export enum EffectSubTypeCustom {
  // We re-use the same subtype that is used in StageAPI for consistency
  FLOOR_EFFECT_CREEP = 12345, // There is no "Isaac.GetEntitySubTypeByName()" function
}

/*
export enum SoundEffectCustom {
  SOUND_SPEEDRUN_FINISH = Isaac.GetSoundIdByName("Speedrun Finish"),
}
*/
