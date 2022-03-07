// Racing+ removes some items from the game for various reasons
// This feature is not configurable because it could cause a seed to be different

import {
  anyPlayerHasCollectible,
  anyPlayerIs,
  getCollectibles,
  getPlayersOfType,
  saveDataManager,
  setCollectibleSubType,
} from "isaacscript-common";
import g from "../../../globals";
import { giveCollectibleAndRemoveFromPools } from "../../../utilsGlobals";
import * as showEdenStartingItems from "../../optional/characters/showEdenStartingItems";
import { getEdenReplacementCollectibleType } from "../../optional/gameplay/extraStartingItems/replacePlaceholdersOnEden";
import { inSeededRace } from "../../race/v";
import {
  BANNED_COLLECTIBLES,
  BANNED_COLLECTIBLES_ON_SEEDED_RACES,
  BANNED_COLLECTIBLES_WITH_VOID,
  BANNED_TRINKETS,
  BANNED_TRINKETS_ON_SEEDED_RACES,
} from "./constants";

const v = {
  run: {
    startedWithVoid: false,
    startedWithCompass: false,
  },
};

export function init(): void {
  saveDataManager("removeGloballyBannedItems", v);
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  removeBannedItemsFromPools();
  replaceEdenBannedItems();
}

function removeBannedItemsFromPools() {
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

  if (inSeededRace()) {
    for (const bannedCollectible of BANNED_COLLECTIBLES_ON_SEEDED_RACES.values()) {
      g.itemPool.RemoveCollectible(bannedCollectible);
    }

    for (const bannedTrinket of BANNED_TRINKETS_ON_SEEDED_RACES.values()) {
      g.itemPool.RemoveTrinket(bannedTrinket);
    }
  }

  // Tainted Magdalene is invincible with Sharp Plug
  if (anyPlayerIs(PlayerType.PLAYER_MAGDALENE_B)) {
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SHARP_PLUG);
  }
}

/**
 * Mercurius and TMTRAINER have the "noeden" tag added in "items_metadata.xml", so we do not have to
 * worry about those.
 */
function replaceEdenBannedItems() {
  // The only items to worry about are the ones that are conditionally banned in seeded races
  if (inSeededRace()) {
    return;
  }

  const edens = getPlayersOfType(
    PlayerType.PLAYER_EDEN,
    PlayerType.PLAYER_EDEN_B,
  );
  for (const player of edens) {
    for (const collectibleType of BANNED_COLLECTIBLES_ON_SEEDED_RACES.values()) {
      if (player.HasCollectible(collectibleType)) {
        player.RemoveCollectible(collectibleType);
        addNewRandomPassiveToEden(player);
      }
    }

    if (v.run.startedWithCompass) {
      addNewRandomPassiveToEden(player);
    }

    for (const trinketType of BANNED_TRINKETS_ON_SEEDED_RACES.values()) {
      if (player.HasTrinket(trinketType)) {
        player.TryRemoveTrinket(trinketType);
        // (don't reward them with a new trinket, since Eden doesn't always start with a trinket)
      }
    }
  }
}

function addNewRandomPassiveToEden(player: EntityPlayer) {
  const replacementCollectibleType = getEdenReplacementCollectibleType(player);
  showEdenStartingItems.changeStartingPassiveItem(replacementCollectibleType);
  giveCollectibleAndRemoveFromPools(player, replacementCollectibleType);
}

// ModCallbacks.MC_USE_ITEM (3)
// CollectibleType.COLLECTIBLE_SPINDOWN_DICE (723)
export function useItemSpindownDice(): void {
  for (const collectible of getCollectibles()) {
    if (isBannedCollectible(collectible)) {
      // Skip over the banned collectible and turn it into the one before that
      setCollectibleSubType(collectible, collectible.SubType - 1);
    }
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  // Prevent getting banned items on the Death Certificate floor
  for (const collectible of getCollectibles()) {
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

  if (inSeededRace()) {
    if (BANNED_COLLECTIBLES_ON_SEEDED_RACES.has(entity.SubType)) {
      return true;
    }
  }

  if (
    anyPlayerIs(PlayerType.PLAYER_MAGDALENE_B) &&
    entity.SubType === CollectibleType.COLLECTIBLE_SHARP_PLUG
  ) {
    return true;
  }

  return false;
}

export function setStartedWithCompass(): void {
  v.run.startedWithCompass = true;
}
