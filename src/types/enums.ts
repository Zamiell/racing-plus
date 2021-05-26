// EntityType.ENTITY_FAMILIAR (3)
export enum FamiliarVariantCustom {
  PASCHAL_CANDLE_FAST_CLEAR = Isaac.GetEntityVariantByName(
    "Paschal Candle (Fast-Clear)",
  ),
}

// EntityType.ENTITY_PICKUP (5)
export enum PickupVariantCustom {
  INVISIBLE_PICKUP = Isaac.GetEntityVariantByName("Invisible Pickup"),
}

export enum PickupPriceCustom {
  // This can be any arbitrary value between -7 and -999; see the PickupPrice enum
  PRICE_NO_MINIMAP = -50,
}

// EntityType.ENTITY_EFFECT (1000)
export enum EffectVariantCustom {
  TRAPDOOR_FAST_TRAVEL = Isaac.GetEntityVariantByName("Trapdoor (Fast-Travel)"),
  CRAWLSPACE_FAST_TRAVEL = Isaac.GetEntityVariantByName(
    "Crawlspace (Fast-Travel)",
  ),
  WOMB_TRAPDOOR_FAST_TRAVEL = Isaac.GetEntityVariantByName(
    "Womb Trapdoor (Fast-Travel)",
  ),
  BLUE_WOMB_TRAPDOOR_FAST_TRAVEL = Isaac.GetEntityVariantByName(
    "Blue Womb Trapdoor (Fast-Travel)",
  ),
  HEAVEN_DOOR_FAST_TRAVEL = Isaac.GetEntityVariantByName(
    "Heaven Door (Fast-Travel)",
  ),
  VOID_PORTAL_FAST_TRAVEL = Isaac.GetEntityVariantByName(
    "Void Portal (Fast-Travel)",
  ),
}

export enum EffectSubTypeCustom {
  // We re-use the same subtype that is used in StageAPI for consistency
  FLOOR_EFFECT_CREEP = 12345, // There is no "Isaac.GetEntitySubTypeByName()" function
}

export enum SaveFileState {
  NOT_CHECKED,
  DEFERRED_UNTIL_NEW_RUN_BEGINS,
  /** Going to the set seed with Eden. */
  GOING_TO_EDEN,
  /** Going back to the old challenge/character/seed. */
  GOING_BACK,
  FINISHED,
}
