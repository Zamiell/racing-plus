import { getMaxCollectibleID, isPassiveCollectible } from "isaacscript-common";
import { PLACEHOLDER_COLLECTIBLES_SET } from "./features/optional/gameplay/extraStartingItems/constants";
import g from "./globals";
import { CollectibleTypeCustom } from "./types/CollectibleTypeCustom";

export const PASSIVE_ITEMS_FOR_EDEN: Array<
  CollectibleType | CollectibleTypeCustom
> = [];

export function init(): void {
  for (let i = 1; i <= getMaxCollectibleID(); i++) {
    const itemConfigItem = g.itemConfig.GetCollectible(i);
    if (
      isPassiveCollectible(i) &&
      itemConfigItem !== undefined &&
      !itemConfigItem.Hidden &&
      !PLACEHOLDER_COLLECTIBLES_SET.has(i)
    ) {
      PASSIVE_ITEMS_FOR_EDEN.push(itemConfigItem.ID);
    }
  }
}
