import { TrinketType } from "isaac-typescript-definitions";
import {
  arrayRemoveInPlace,
  copyArray,
  getVanillaTrinketArray,
} from "isaacscript-common";
import { BANNED_TRINKETS } from "../../mandatory/removeGloballyBannedItems/constants";
import { BANNED_DIVERSITY_TRINKETS } from "../../race/formatSetup";

/**
 * These are trinkets that can never be assigned as random starting items, but can still be found in
 * the trinket pool in the middle of a run.
 *
 * This only applies during R+7 Season 3, not during diversity races.
 */
const DIVERSITY_TRINKET_TYPE_BLACKLIST_SEASON_ONLY: readonly TrinketType[] = [
  TrinketType.OUROBOROS_WORM,
];

export const DIVERSITY_TRINKET_TYPES = copyArray(getVanillaTrinketArray());
arrayRemoveInPlace(
  DIVERSITY_TRINKET_TYPES,
  ...BANNED_TRINKETS,
  ...BANNED_DIVERSITY_TRINKETS,
  ...DIVERSITY_TRINKET_TYPE_BLACKLIST_SEASON_ONLY,
);
