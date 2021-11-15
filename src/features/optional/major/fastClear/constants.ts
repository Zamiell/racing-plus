export const FAST_CLEAR_DEBUG = true;

export const ATTACHED_NPCS_TYPE_VARIANT = new Set<string>([
  `${EntityType.ENTITY_VIS}.${VisVariant.CHUBBER_PROJECTILE}`,
  `${EntityType.ENTITY_DEATH}.${DeathVariant.DEATH_SCYTHE}`,
  `${EntityType.ENTITY_PEEP}.${PeepVariant.PEEP_EYE}`,
  `${EntityType.ENTITY_PEEP}.${PeepVariant.BLOAT_EYE}`,
  `${EntityType.ENTITY_BEGOTTEN}.${BegottenVariant.BEGOTTEN_CHAIN}`,
  `${EntityType.ENTITY_MAMA_GURDY}.${MamaGurdyVariant.LEFT_HAND}`,
  `${EntityType.ENTITY_MAMA_GURDY}.${MamaGurdyVariant.RIGHT_HAND}`,
  `${EntityType.ENTITY_BIG_HORN}.${BigHornVariant.SMALL_HOLE}`,
  `${EntityType.ENTITY_BIG_HORN}.${BigHornVariant.BIG_HOLE}`,
]);

export const ATTACHED_NPCS_TYPE_VARIANT_SUBTYPE = new Set<string>([
  `${EntityType.ENTITY_CHARGER}.${ChargerVariant.CHARGER}.${ChargerSubType.MY_SHADOW}`,
]);

export const CREEP_VARIANTS_TO_KILL = new Set([
  EffectVariant.CREEP_RED, // 22
  EffectVariant.CREEP_GREEN, // 23
  EffectVariant.CREEP_YELLOW, // 24
  EffectVariant.CREEP_WHITE, // 25
  EffectVariant.CREEP_BLACK, // 26
  EffectVariant.CREEP_BROWN, // 56
  EffectVariant.CREEP_SLIPPERY_BROWN, // 94
]);

export const EARLY_CLEAR_ROOM_TYPE_BLACKLIST = new Set([
  RoomType.ROOM_CHALLENGE, // 11
  RoomType.ROOM_BOSSRUSH, // 17
]);
