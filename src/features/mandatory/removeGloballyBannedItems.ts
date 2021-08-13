// Racing+ removes some items from the game for various reasons
// This feature is not configurable because it could change trinket pools and cause a seed to be
// different

import { getPlayers } from "isaacscript-common";
import g from "../../globals";

const BANNED_COLLECTIBLES = [
  CollectibleType.COLLECTIBLE_MERCURIUS, // It is too powerful
  CollectibleType.COLLECTIBLE_TMTRAINER, // It is too powerful
];

const BANNED_TRINKETS = [
  TrinketType.TRINKET_KARMA, // Since all Donation Machines are removed, it has no purpose
];

const EDEN_REPLACEMENT_ITEM = CollectibleType.COLLECTIBLE_SAD_ONION;

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  for (const bannedCollectible of BANNED_COLLECTIBLES) {
    g.itemPool.RemoveCollectible(bannedCollectible);

    // If Eden started with a banned item, replace it
    for (const player of getPlayers()) {
      if (player.HasCollectible(bannedCollectible)) {
        player.RemoveCollectible(bannedCollectible);
        player.AddCollectible(EDEN_REPLACEMENT_ITEM);
      }
    }
  }

  for (const bannedTrinket of BANNED_TRINKETS) {
    g.itemPool.RemoveTrinket(bannedTrinket);

    // If Eden started with a banned trinket, delete it
    for (const player of getPlayers()) {
      if (player.HasTrinket(bannedTrinket)) {
        player.TryRemoveTrinket(bannedTrinket);
      }
    }
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );

  // Prevent getting banned items on the Death Certificate floor
  for (const collectible of collectibles) {
    if (BANNED_COLLECTIBLES.includes(collectible.SubType)) {
      collectible.Remove();
    }
  }
}
