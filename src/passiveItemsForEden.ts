import { CollectibleType, ItemConfigTag } from "isaac-typescript-definitions";
import {
  collectibleHasTag,
  irange,
  isPassiveCollectible,
  itemConfig,
  MAX_COLLECTIBLE_TYPE,
} from "isaacscript-common";
import { PLACEHOLDER_COLLECTIBLES_SET } from "./features/optional/gameplay/extraStartingItems/constants";

export const PASSIVE_ITEMS_FOR_EDEN: CollectibleType[] = [];

export function init(): void {
  for (const collectibleTypeInt of irange(1, MAX_COLLECTIBLE_TYPE)) {
    const collectibleType = collectibleTypeInt as CollectibleType;
    const itemConfigItem = itemConfig.GetCollectible(collectibleType);
    if (
      itemConfigItem !== undefined &&
      !itemConfigItem.Hidden &&
      !collectibleHasTag(collectibleType, ItemConfigTag.NO_EDEN) &&
      !PLACEHOLDER_COLLECTIBLES_SET.has(collectibleType) &&
      isPassiveCollectible(collectibleType)
    ) {
      PASSIVE_ITEMS_FOR_EDEN.push(itemConfigItem.ID);
    }
  }
}
