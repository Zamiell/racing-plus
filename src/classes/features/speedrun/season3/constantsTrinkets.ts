import { TrinketType } from "isaac-typescript-definitions";
import { BANNED_TRINKETS } from "../../../../features/mandatory/removeGloballyBannedItems/constants";
import { BANNED_DIVERSITY_TRINKETS } from "../../../../features/race/formatSetup";
import { mod } from "../../../../mod";

/**
 * These are trinkets that can never be assigned as random starting items, but can still be found in
 * the trinket pool in the middle of a run.
 *
 * This only applies during R+7 Season 3, not during diversity races.
 */
const DIVERSITY_TRINKET_TYPE_BLACKLIST_SEASON_ONLY = [
  TrinketType.OUROBOROS_WORM,
] as const;

export const DIVERSITY_TRINKET_TYPES: readonly TrinketType[] = (() => {
  const vanillaTrinketArray = mod.getVanillaTrinketArray();
  const removedStartingTrinketTypesSet = new Set<TrinketType>([
    ...BANNED_TRINKETS,
    ...BANNED_DIVERSITY_TRINKETS,
    ...DIVERSITY_TRINKET_TYPE_BLACKLIST_SEASON_ONLY,
  ]);

  const diversityTrinketTypes: TrinketType[] = [];

  for (const trinketType of vanillaTrinketArray) {
    if (removedStartingTrinketTypesSet.has(trinketType)) {
      continue;
    }

    diversityTrinketTypes.push(trinketType);
  }

  return diversityTrinketTypes;
})();