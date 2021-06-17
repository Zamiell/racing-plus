export enum EntityTypeCustom {
  ENTITY_RACE_TROPHY = Isaac.GetEntityTypeByName("Race Trophy"),
}

// EntityType.ENTITY_EFFECT (1000)
export enum EffectVariantCustom {
  PITFALL_CUSTOM = Isaac.GetEntityVariantByName("Pitfall (Custom)"),
}

export enum CollectibleTypeCustom {
  COLLECTIBLE_13_LUCK = Isaac.GetItemIdByName("13 Luck"),

  // Utility items
  COLLECTIBLE_TROPHY = Isaac.GetItemIdByName("Trophy"),
  COLLECTIBLE_CHECKPOINT = Isaac.GetItemIdByName("Checkpoint"),
  COLLECTIBLE_OFF_LIMITS = Isaac.GetItemIdByName("Off Limits"),
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

// Needs to be here to avoid a dependency cycle
export enum SaveFileState {
  NotChecked,
  DeferredUntilNewRunBegins,
  GoingToSetSeedWithEden,
  /** Going back to the old challenge/character/seed. */
  GoingBack,
  Finished,
}
