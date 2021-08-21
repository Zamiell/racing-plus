// Racing+ removes some items from the game for various reasons
// This feature is not configurable because it could change trinket pools and cause a seed to be
// different

import {
  anyPlayerHasCollectible,
  getPlayers,
  getRandomArrayElement,
} from "isaacscript-common";
import g from "../../../globals";
import passiveItemsForEden from "../../../passiveItemsForEden";
import * as showEdenStartingItems from "../../optional/quality/showEdenStartingItems";
import {
  BANNED_COLLECTIBLES,
  BANNED_COLLECTIBLES_WITH_VOID,
  BANNED_TRINKETS,
} from "./constants";

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  for (const bannedCollectible of BANNED_COLLECTIBLES) {
    g.itemPool.RemoveCollectible(bannedCollectible);

    // If Eden started with a banned item, replace it
    for (const player of getPlayers()) {
      if (player.HasCollectible(bannedCollectible)) {
        const startSeed = g.seeds.GetStartSeed();
        const edenReplacementItem = getRandomArrayElement(
          passiveItemsForEden,
          startSeed,
        );
        player.RemoveCollectible(bannedCollectible);
        player.AddCollectible(edenReplacementItem);
        showEdenStartingItems.changeStartingPassiveItem(edenReplacementItem);
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

  if (anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_VOID)) {
    for (const bannedCollectible of BANNED_COLLECTIBLES_WITH_VOID) {
      g.itemPool.RemoveCollectible(bannedCollectible);
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
