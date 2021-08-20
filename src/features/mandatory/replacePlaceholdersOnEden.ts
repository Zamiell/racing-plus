import {
  getRandomArrayElement,
  isQuestItem,
  MAX_VANILLA_COLLECTIBLE_TYPE,
} from "isaacscript-common";
import g from "../../globals";
import { giveCollectibleAndRemoveFromPools } from "../../utilGlobals";
import { COLLECTIBLE_REPLACEMENT_MAP } from "../optional/quality/moreStartingItems";
import { BANNED_COLLECTIBLES } from "./removeGloballyBannedItems";

const passiveItemsArray = [] as number[];

export default function init(): void {
  for (let i = 1; i <= MAX_VANILLA_COLLECTIBLE_TYPE; i++) {
    const itemConfigItem = g.itemConfig.GetCollectible(i);
    if (
      itemConfigItem !== null &&
      (itemConfigItem.Type === ItemType.ITEM_PASSIVE ||
        itemConfigItem.Type === ItemType.ITEM_FAMILIAR) &&
      !BANNED_COLLECTIBLES.includes(itemConfigItem.ID) &&
      !isQuestItem(itemConfigItem.ID)
    ) {
      Isaac.DebugString(itemConfigItem.ID.toString());
      passiveItemsArray.push(itemConfigItem.ID);
    }
  }

  removePlaceholdersOnEdenPostGameStarted();
}

function removePlaceholdersOnEdenPostGameStarted(): void {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const startSeed = g.seeds.GetStartSeed();
  const newCollectible = getRandomArrayElement(passiveItemsArray, startSeed);

  if (
    character !== PlayerType.PLAYER_EDEN &&
    character !== PlayerType.PLAYER_EDEN_B
  ) {
    return;
  }

  for (const [placeholderItem] of COLLECTIBLE_REPLACEMENT_MAP) {
    if (player.HasCollectible(placeholderItem)) {
      player.RemoveCollectible(placeholderItem);
      giveCollectibleAndRemoveFromPools(player, newCollectible);
    }
  }
}
