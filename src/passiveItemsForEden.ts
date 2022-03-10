import {
  collectibleHasTag,
  getMaxCollectibleType,
  isPassiveCollectible,
  itemConfig,
  range,
} from "isaacscript-common";
import { PLACEHOLDER_COLLECTIBLES_SET } from "./features/optional/gameplay/extraStartingItems/constants";

export const PASSIVE_ITEMS_FOR_EDEN: CollectibleType[] = [];

export function init(): void {
  const maxCollectibleType = getMaxCollectibleType();
  for (const collectibleType of range(1, maxCollectibleType)) {
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
