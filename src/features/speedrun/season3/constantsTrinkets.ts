import { TrinketType } from "isaac-typescript-definitions";
import { getVanillaTrinketTypes } from "isaacscript-common";
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

export const DIVERSITY_TRINKET_TYPES: TrinketType[] = [];

export function initDiversityTrinketTypes(): void {
  const vanillaTrinketTypes = getVanillaTrinketTypes();
  const removedStartingTrinketTypesSet = new Set<TrinketType>([
    ...BANNED_TRINKETS,
    ...BANNED_DIVERSITY_TRINKETS,
    ...DIVERSITY_TRINKET_TYPE_BLACKLIST_SEASON_ONLY,
  ]);

  for (const trinketType of vanillaTrinketTypes) {
    if (removedStartingTrinketTypesSet.has(trinketType)) {
      continue;
    }

    DIVERSITY_TRINKET_TYPES.push(trinketType);
  }
}
