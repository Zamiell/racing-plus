import { EffectVariant, RoomType } from "isaac-typescript-definitions";

export const FAST_CLEAR_DEBUG = false;

export const CREEP_VARIANTS_TO_KILL: ReadonlySet<EffectVariant> = new Set([
  EffectVariant.CREEP_RED, // 22
  EffectVariant.CREEP_GREEN, // 23
  EffectVariant.CREEP_YELLOW, // 24
  EffectVariant.CREEP_WHITE, // 25
  EffectVariant.CREEP_BLACK, // 26
  EffectVariant.CREEP_BROWN, // 56
  EffectVariant.CREEP_SLIPPERY_BROWN, // 94
]);

export const EARLY_CLEAR_ROOM_TYPE_BLACKLIST: ReadonlySet<RoomType> = new Set([
  RoomType.CHALLENGE, // 11
  RoomType.BOSS_RUSH, // 17
]);
