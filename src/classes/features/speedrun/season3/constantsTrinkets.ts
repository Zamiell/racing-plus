import { TrinketType } from "isaac-typescript-definitions";
import { VANILLA_TRINKET_TYPES } from "isaacscript-common";
import { BANNED_TRINKETS } from "../../mandatory/removals/RemoveGloballyBannedItems";
import { BANNED_DIVERSITY_TRINKETS } from "../../race/RaceFormatSetup";

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
  const removedStartingTrinketTypesSet = new Set<TrinketType>([
    ...BANNED_TRINKETS,
    ...BANNED_DIVERSITY_TRINKETS,
    ...DIVERSITY_TRINKET_TYPE_BLACKLIST_SEASON_ONLY,
  ]);

  const diversityTrinketTypes: TrinketType[] = [];

  for (const trinketType of VANILLA_TRINKET_TYPES) {
    if (removedStartingTrinketTypesSet.has(trinketType)) {
      continue;
    }

    diversityTrinketTypes.push(trinketType);
  }

  return diversityTrinketTypes;
})();
