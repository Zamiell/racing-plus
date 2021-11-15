// Racing+ removes some items from the game for various reasons
// This feature is not configurable because it could cause a seed to be different

import {
  anyPlayerHasCollectible,
  anyPlayerIs,
  changeCollectibleSubType,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import {
  BANNED_COLLECTIBLES,
  BANNED_COLLECTIBLES_WITH_VOID,
  BANNED_TRINKETS,
} from "./constants";

const v = {
  run: {
    startedWithVoid: false,
  },
};

export function init(): void {
  saveDataManager("removeGloballyBannedItems", v);
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  for (const bannedCollectible of BANNED_COLLECTIBLES.values()) {
    g.itemPool.RemoveCollectible(bannedCollectible);
  }

  for (const bannedTrinket of BANNED_TRINKETS.values()) {
    g.itemPool.RemoveTrinket(bannedTrinket);
  }

  if (anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_VOID)) {
    v.run.startedWithVoid = true;

    for (const bannedCollectible of BANNED_COLLECTIBLES_WITH_VOID.values()) {
      g.itemPool.RemoveCollectible(bannedCollectible);
    }
  }

  if (anyPlayerIs(PlayerType.PLAYER_MAGDALENE_B)) {
    // Tainted Magdalene is invincible with Sharp Plug
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SHARP_PLUG);
  }
}

// ModCallbacks.MC_USE_ITEM (3)
// CollectibleType.COLLECTIBLE_SPINDOWN_DICE (723)
export function useItemSpindownDice(): void {
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );

  for (const collectible of collectibles) {
    const pickup = collectible.ToPickup();
    if (pickup === undefined) {
      continue;
    }

    if (isBannedCollectible(pickup)) {
      changeCollectibleSubType(pickup, pickup.SubType - 1);
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
    if (isBannedCollectible(collectible)) {
      collectible.Remove();
    }
  }
}

function isBannedCollectible(entity: Entity) {
  if (BANNED_COLLECTIBLES.has(entity.SubType)) {
    return true;
  }

  if (
    v.run.startedWithVoid &&
    BANNED_COLLECTIBLES_WITH_VOID.has(entity.SubType)
  ) {
    return true;
  }

  if (
    anyPlayerIs(PlayerType.PLAYER_MAGDALENE_B) &&
    entity.SubType === CollectibleType.COLLECTIBLE_SHARP_PLUG
  ) {
    return true;
  }

  return false;
}
