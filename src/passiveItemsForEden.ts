import { getMaxCollectibleID, isQuestCollectible } from "isaacscript-common";
import { BANNED_COLLECTIBLES } from "./features/mandatory/removeGloballyBannedItems/constants";
import { COLLECTIBLE_REPLACEMENT_MAP } from "./features/optional/gameplay/extraStartingItems/constants";
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
      !isQuestCollectible(itemConfigItem.ID) &&
      !BANNED_COLLECTIBLES.has(itemConfigItem.ID) &&
      ![...COLLECTIBLE_REPLACEMENT_MAP.keys()].includes(i)
    ) {
      passiveItemsForEden.push(itemConfigItem.ID);
    }
  }

  return passiveItemsForEden;
}
