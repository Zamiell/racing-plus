import { CollectibleType, ItemConfigTag } from "isaac-typescript-definitions";
import {
  collectibleHasTag,
  getCollectibleTypeRange,
  isPassiveCollectible,
  itemConfig,
} from "isaacscript-common";
import { PLACEHOLDER_COLLECTIBLES_SET } from "./features/optional/gameplay/extraStartingItems/constants";

export const PASSIVE_ITEMS_FOR_EDEN: CollectibleType[] = [];

export function init(): void {
  for (const collectibleType of getCollectibleTypeRange()) {
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
