export enum SaveFileState {
  NOT_CHECKED,
  GOING_TO_EDEN, // Going to the set seed with Eden
  GOING_BACK, // Going back to the old challenge/character/seed
  FINISHED,
}

export enum SeededDeathState {
  DISABLED,
  DEATH_ANIMATION,
  CHANGING_ROOMS,
  FETAL_POSITION,
  GHOST_FORM,
}

export enum EntityTypeCustom {
  ENTITY_RACE_TROPHY = Isaac.GetEntityTypeByName("Race Trophy"),
  ENTITY_ROOM_CLEAR_DELAY_NPC = Isaac.GetEntityTypeByName(
    "Room Clear Delay NPC",
  ),
  ENTITY_SAMAEL_SCYTHE = Isaac.GetEntityTypeByName("Samael Scythe"),
  ENTITY_SAMAEL_SPECIAL_ANIMATIONS = Isaac.GetEntityTypeByName(
    "Samael Special Animations",
  ),
}

// EntityType.ENTITY_TEAR (2)
export enum TearVariantCustom {
  MAGIC_SCYTHE = Isaac.GetEntityVariantByName("Magic Scythe"),
}

// EntityType.ENTITY_FAMILIAR (3)
export enum FamiliarVariantCustom {
  SCYTHE_HITBOX = Isaac.GetEntityVariantByName("Scythe Hitbox"),
}

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
  MEGA_SATAN_TRAPDOOR = Isaac.GetEntityVariantByName("Mega Satan Trapdoor"),
  PITFALL_CUSTOM = Isaac.GetEntityVariantByName("Pitfall (Custom)"),
  ROOM_CLEAR_DELAY = Isaac.GetEntityVariantByName("Room Clear Delay"),
  CRACK_THE_SKY_BASE = Isaac.GetEntityVariantByName("Crack the Sky Base"),
  STICKY_NICKEL = Isaac.GetEntityVariantByName("Sticky Nickel Effect"),
  INVISIBLE_EFFECT = Isaac.GetEntityVariantByName("Invisible Effect"),
}

export enum PlayerTypeCustom {
  PLAYER_SAMAEL = Isaac.GetPlayerTypeByName("Samael"),
}

export enum CollectibleTypeCustom {
  // Replacing 191
  COLLECTIBLE_3_DOLLAR_BILL_SEEDED = Isaac.GetItemIdByName(
    "3 Dollar Bill (Seeded)",
  ),
  // Replacing 455
  COLLECTIBLE_DADS_LOST_COIN_CUSTOM = Isaac.GetItemIdByName("Dad's Lost Coin"),
  // Replacing 534
  COLLECTIBLE_SCHOOLBAG_CUSTOM = Isaac.GetItemIdByName("Schoolbag"),
  COLLECTIBLE_SOUL_JAR = Isaac.GetItemIdByName("Soul Jar"),
  COLLECTIBLE_13_LUCK = Isaac.GetItemIdByName("13 Luck"),
  COLLECTIBLE_MUTANT_SPIDER_INNER_EYE = Isaac.GetItemIdByName(
    "Mutant Spider's Inner Eye",
  ),
  COLLECTIBLE_TROPHY = Isaac.GetItemIdByName("Trophy"),
  COLLECTIBLE_OFF_LIMITS = Isaac.GetItemIdByName("Off Limits"),
  COLLECTIBLE_CHECKPOINT = Isaac.GetItemIdByName("Checkpoint"),
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
  // Replacing 52
  COLLECTIBLE_SAMAEL_DR_FETUS = Isaac.GetItemIdByName("Samael Dr. Fetus"),
  // Replacing 69
  COLLECTIBLE_SAMAEL_CHOCOLATE_MILK = Isaac.GetItemIdByName(
    "Samael Chocolate Milk",
  ),
  // Replacing 373
  COLLECTIBLE_SAMAEL_DEAD_EYE = Isaac.GetItemIdByName("Samael Dead Eye"),
  // Replacing 394
  COLLECTIBLE_SAMAEL_MARKED = Isaac.GetItemIdByName("Samael Marked"),
  COLLECTIBLE_WRAITH_SKULL = Isaac.GetItemIdByName("Wraith Skull"),
}

export enum SoundEffectCustom {
  SOUND_SPEEDRUN_FINISH = Isaac.GetSoundIdByName("Speedrun Finish"),
  SOUND_WALNUT = Isaac.GetSoundIdByName("Walnut"),
}
