import { getPlayersOfType, getRandomArrayElement } from "isaacscript-common";
import g from "../../../../globals";
import { PASSIVE_ITEMS_FOR_EDEN } from "../../../../passiveItemsForEden";
import { CollectibleTypeCustom } from "../../../../types/CollectibleTypeCustom";
import { giveCollectibleAndRemoveFromPools } from "../../../../utilsGlobals";
import * as showEdenStartingItems from "../../characters/showEdenStartingItems";
import { COLLECTIBLE_REPLACEMENT_MAP } from "./constants";

export function postGameStarted(): void {
  const edens = getPlayersOfType(
    PlayerType.PLAYER_EDEN,
    PlayerType.PLAYER_EDEN_B,
  );
  for (const player of edens) {
    for (const placeholderItem of COLLECTIBLE_REPLACEMENT_MAP.keys()) {
      if (!player.HasCollectible(placeholderItem)) {
        continue;
      }

      player.RemoveCollectible(placeholderItem);
      const replacementCollectibleType =
        getEdenReplacementCollectibleType(player);
      showEdenStartingItems.changeStartingPassiveItem(
        replacementCollectibleType,
      );
      giveCollectibleAndRemoveFromPools(player, replacementCollectibleType);
    }
  }
}

export function getEdenReplacementCollectibleType(
  player: EntityPlayer,
): CollectibleType | CollectibleTypeCustom {
  const startSeed = g.seeds.GetStartSeed();

  let replacementCollectible: CollectibleType | CollectibleTypeCustom;
  do {
    replacementCollectible = getRandomArrayElement(
      PASSIVE_ITEMS_FOR_EDEN,
      startSeed,
    );
  } while (!player.HasCollectible(replacementCollectible));

  return replacementCollectible;
}
