import {
  getMaxCollectibleType,
  isPassiveCollectible,
  range,
} from "isaacscript-common";
import { PLACEHOLDER_COLLECTIBLES_SET } from "./features/optional/gameplay/extraStartingItems/constants";
import g from "./globals";
import { CollectibleTypeCustom } from "./types/CollectibleTypeCustom";

export const PASSIVE_ITEMS_FOR_EDEN: Array<
  CollectibleType | CollectibleTypeCustom
> = [];

export function init(): void {
  const maxCollectibleType = getMaxCollectibleType();
  for (const collectibleType of range(1, maxCollectibleType)) {
    const itemConfigItem = g.itemConfig.GetCollectible(collectibleType);
    if (
      itemConfigItem !== undefined &&
      !itemConfigItem.Hidden &&
      !PLACEHOLDER_COLLECTIBLES_SET.has(collectibleType) &&
      isPassiveCollectible(collectibleType)
    ) {
      PASSIVE_ITEMS_FOR_EDEN.push(itemConfigItem.ID);
    }
  }
}
