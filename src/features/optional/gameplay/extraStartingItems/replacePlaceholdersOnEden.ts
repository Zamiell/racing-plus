import { getPlayersOfType, getRandomArrayElement } from "isaacscript-common";
import g from "../../../../globals";
import { PASSIVE_ITEMS_FOR_EDEN } from "../../../../passiveItemsForEden";
import { giveCollectibleAndRemoveFromPools } from "../../../../utilGlobals";
import * as showEdenStartingItems from "../../characters/showEdenStartingItems";
import { COLLECTIBLE_REPLACEMENT_MAP } from "./constants";

export function postGameStarted(): void {
  const startSeed = g.seeds.GetStartSeed();

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
      const newCollectible = getRandomArrayElement(
        PASSIVE_ITEMS_FOR_EDEN,
        startSeed,
      );
      showEdenStartingItems.changeStartingPassiveItem(newCollectible);
      giveCollectibleAndRemoveFromPools(player, newCollectible);
    }
  }
}
