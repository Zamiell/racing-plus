// This feature is not configurable because it could change trinket pools and cause a seed to be
// different

import g from "../../globals";
import { getPlayers } from "../../misc";

export function postGameStarted(): void {
  // Racing+ removes Mercurius from the game (for balance reasons)
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MERCURIUS);

  // If Eden started with Mercurius, replace it with a Sad Onion
  for (const player of getPlayers()) {
    if (player.HasCollectible(CollectibleType.COLLECTIBLE_MERCURIUS)) {
      player.RemoveCollectible(CollectibleType.COLLECTIBLE_MERCURIUS);
      player.AddCollectible(CollectibleType.COLLECTIBLE_SAD_ONION);
    }
  }
}
