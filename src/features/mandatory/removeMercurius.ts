// This feature is not configurable because it could change trinket pools and cause a seed to be
// different

import { getPlayers } from "isaacscript-common";
import g from "../../globals";

// ModCallbacks.MC_POST_GAME_STARTED (15)
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

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const mercuriuses = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    CollectibleType.COLLECTIBLE_MERCURIUS,
  );
  for (const mercurius of mercuriuses) {
    mercurius.Remove();
  }
}
