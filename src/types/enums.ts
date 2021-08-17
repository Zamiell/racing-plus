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

  // Placeholders
  COLLECTIBLE_ITEM_PLACEHOLDER_1 = Isaac.GetItemIdByName("Item Placeholder 1"),
  COLLECTIBLE_ITEM_PLACEHOLDER_2 = Isaac.GetItemIdByName("Item Placeholder 2"),
  COLLECTIBLE_ITEM_PLACEHOLDER_3 = Isaac.GetItemIdByName("Item Placeholder 3"),
  COLLECTIBLE_ITEM_PLACEHOLDER_4 = Isaac.GetItemIdByName("Item Placeholder 4"),
  COLLECTIBLE_ITEM_PLACEHOLDER_5 = Isaac.GetItemIdByName("Item Placeholder 5"),
  COLLECTIBLE_ITEM_PLACEHOLDER_6 = Isaac.GetItemIdByName("Item Placeholder 6"),
  COLLECTIBLE_ITEM_PLACEHOLDER_7 = Isaac.GetItemIdByName("Item Placeholder 7"),
  COLLECTIBLE_ITEM_PLACEHOLDER_8 = Isaac.GetItemIdByName("Item Placeholder 8"),
  COLLECTIBLE_ITEM_PLACEHOLDER_9 = Isaac.GetItemIdByName("Item Placeholder 9"),
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
