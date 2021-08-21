import { getRandomArrayElement } from "isaacscript-common";
import g from "../../../../globals";
import passiveItemsForEden from "../../../../passiveItemsForEden";
import { giveCollectibleAndRemoveFromPools } from "../../../../utilGlobals";
import { COLLECTIBLE_REPLACEMENT_MAP } from "./constants";

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

  for (const placeholderItem of COLLECTIBLE_REPLACEMENT_MAP.keys()) {
    if (player.HasCollectible(placeholderItem)) {
      player.RemoveCollectible(placeholderItem);
      giveCollectibleAndRemoveFromPools(player, newCollectible);
    }
  }
}
