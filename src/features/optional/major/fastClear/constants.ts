export const FAST_CLEAR_DEBUG = true;

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
