import { getPlayers, getRandomArrayElement } from "isaacscript-common";
import g from "../../../../globals";
import passiveItemsForEden from "../../../../passiveItemsForEden";
import { giveCollectibleAndRemoveFromPools } from "../../../../utilGlobals";
import { COLLECTIBLE_REPLACEMENT_MAP } from "./constants";

export function postGameStarted(): void {
  const startSeed = g.seeds.GetStartSeed();

  for (const player of getPlayers()) {
    const character = player.GetPlayerType();
    if (
      character !== PlayerType.PLAYER_EDEN &&
      character !== PlayerType.PLAYER_EDEN_B
    ) {
      continue;
    }

    for (const placeholderItem of COLLECTIBLE_REPLACEMENT_MAP.keys()) {
      if (!player.HasCollectible(placeholderItem)) {
        continue;
      }

      player.RemoveCollectible(placeholderItem);
      const newCollectible = getRandomArrayElement(
        passiveItemsForEden,
        startSeed,
      );
      giveCollectibleAndRemoveFromPools(player, newCollectible);
    }
  }
}
