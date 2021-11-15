import { getMaxCollectibleID } from "isaacscript-common";
import { PLACEHOLDER_COLLECTIBLES_SET } from "./features/optional/gameplay/extraStartingItems/constants";
import g from "./globals";
import { CollectibleTypeCustom } from "./types/enums";

export const passiveItemsForEden: Array<
  CollectibleType | CollectibleTypeCustom
> = [];

export function init(): Array<CollectibleType | CollectibleTypeCustom> {
  for (let i = 1; i <= getMaxCollectibleID(); i++) {
    const itemConfigItem = g.itemConfig.GetCollectible(i);
    if (
      itemConfigItem !== undefined &&
      (itemConfigItem.Type === ItemType.ITEM_PASSIVE ||
        itemConfigItem.Type === ItemType.ITEM_FAMILIAR) &&
      !itemConfigItem.Hidden &&
      !PLACEHOLDER_COLLECTIBLES_SET.has(i)
    ) {
      passiveItemsForEden.push(itemConfigItem.ID);
    }
  }

  return passiveItemsForEden;
}
