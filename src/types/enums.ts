// EntityType.ENTITY_PICKUP (5)
export enum PickupVariantCustom {
  INVISIBLE_PICKUP = Isaac.GetEntityVariantByName("Invisible Pickup"),
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
