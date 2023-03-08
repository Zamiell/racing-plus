import { EffectVariant, RoomType } from "isaac-typescript-definitions";
import { ReadonlySet } from "isaacscript-common";

export const FAST_CLEAR_DEBUG = false as boolean;

export const CREEP_VARIANTS_TO_KILL = new ReadonlySet<EffectVariant>([
  EffectVariant.CREEP_RED, // 22
  EffectVariant.CREEP_GREEN, // 23
  EffectVariant.CREEP_YELLOW, // 24
  EffectVariant.CREEP_WHITE, // 25
  EffectVariant.CREEP_BLACK, // 26
  EffectVariant.CREEP_BROWN, // 56
  EffectVariant.CREEP_SLIPPERY_BROWN, // 94
]);

export const EARLY_CLEAR_ROOM_TYPE_BLACKLIST = new ReadonlySet<RoomType>([
  RoomType.CHALLENGE, // 11
  RoomType.BOSS_RUSH, // 17
]);
