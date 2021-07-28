export enum EntityTypeCustom {
  ENTITY_RACE_TROPHY = Isaac.GetEntityTypeByName("Race Trophy"),
  ENTITY_ROOM_CLEAR_DELAY_NPC = Isaac.GetEntityTypeByName(
    "Room Clear Delay NPC",
  ),
}

// EntityType.ENTITY_PICKUP (5)
export enum PickupVariantCustom {
  INVISIBLE_PICKUP = Isaac.GetEntityVariantByName("Invisible Pickup"),
}

// EntityType.ENTITY_EFFECT (1000)
export enum EffectVariantCustom {
  PITFALL_CUSTOM = Isaac.GetEntityVariantByName("Pitfall (Custom)"),
  ROOM_CLEAR_DELAY = Isaac.GetEntityVariantByName("Room Clear Delay Effect"),
}

export enum CollectibleTypeCustom {
  COLLECTIBLE_13_LUCK = Isaac.GetItemIdByName("13 Luck"),
  COLLECTIBLE_15_LUCK = Isaac.GetItemIdByName("15 Luck"),

  // Utility items
  COLLECTIBLE_TROPHY = Isaac.GetItemIdByName("Trophy"),
  COLLECTIBLE_CHECKPOINT = Isaac.GetItemIdByName("Checkpoint"),
  COLLECTIBLE_RESET = Isaac.GetItemIdByName("Reset"),
  COLLECTIBLE_DIVERSITY_PLACEHOLDER_1 = Isaac.GetItemIdByName(
    "Diversity Placeholder 1",
  ),
  COLLECTIBLE_DIVERSITY_PLACEHOLDER_2 = Isaac.GetItemIdByName(
    "Diversity Placeholder 2",
  ),
  COLLECTIBLE_DIVERSITY_PLACEHOLDER_3 = Isaac.GetItemIdByName(
    "Diversity Placeholder 3",
  ),
  COLLECTIBLE_DEBUG = Isaac.GetItemIdByName("Debug"),
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

export enum SoundEffectCustom {
  SOUND_SPEEDRUN_FINISH = Isaac.GetSoundIdByName("Speedrun Finish"),
}
