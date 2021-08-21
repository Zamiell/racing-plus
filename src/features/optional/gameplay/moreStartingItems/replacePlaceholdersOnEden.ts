import { getRandomArrayElement } from "isaacscript-common";
import g from "../../../../globals";
import { getPassiveItemsForEden } from "../../../../util";
import { giveCollectibleAndRemoveFromPools } from "../../../../utilGlobals";
import { COLLECTIBLE_REPLACEMENT_MAP } from "./moreStartingItems";

let passiveItemsForEden = [] as number[];

export function init(): void {
  passiveItemsForEden = getPassiveItemsForEden();
}

export function postGameStarted(): void {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const startSeed = g.seeds.GetStartSeed();
  const newCollectible = getRandomArrayElement(passiveItemsForEden, startSeed);

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
