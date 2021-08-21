import { getMaxCollectibleID, isQuestItem } from "isaacscript-common";
import { BANNED_COLLECTIBLES } from "./features/mandatory/removeGloballyBannedItems/constants";
import { COLLECTIBLE_REPLACEMENT_MAP } from "./features/optional/gameplay/extraStartingItems/constants";
import g from "./globals";
import { CollectibleTypeCustom } from "./types/enums";

const passiveItemsForEden: Array<CollectibleType | CollectibleTypeCustom> = [];
export default passiveItemsForEden;

export function init(): number[] {
  for (let i = 1; i <= getMaxCollectibleID(); i++) {
    const itemConfigItem = g.itemConfig.GetCollectible(i);
    if (
      itemConfigItem !== null &&
      (itemConfigItem.Type === ItemType.ITEM_PASSIVE ||
        itemConfigItem.Type === ItemType.ITEM_FAMILIAR) &&
      !itemConfigItem.Hidden &&
      !isQuestItem(itemConfigItem.ID) &&
      !BANNED_COLLECTIBLES.includes(itemConfigItem.ID) &&
      ![...COLLECTIBLE_REPLACEMENT_MAP.keys()].includes(i)
    ) {
      passiveItemsForEden.push(itemConfigItem.ID);
    }
  }

  return passiveItemsForEden;
}
