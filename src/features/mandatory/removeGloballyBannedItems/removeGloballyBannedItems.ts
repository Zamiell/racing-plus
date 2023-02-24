// Racing+ removes some items from the game for various reasons.

// This feature is not configurable because it could cause a seed to be different.

import { CollectibleType, PlayerType } from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  anyPlayerIs,
  asCollectibleType,
  asNumber,
  game,
  getCollectibles,
  getPlayersOfType,
  newRNG,
  removeCollectibleFromPools,
  removeTrinketFromPools,
  setCollectibleSubType,
} from "isaacscript-common";
import * as showEdenStartingItems from "../../../classes/features/optional/characters/ShowEdenStartingItems";
import { mod } from "../../../mod";
import { addCollectibleAndRemoveFromPools } from "../../../utils";
import { PLACEHOLDER_COLLECTIBLE_TYPES } from "../../optional/gameplay/extraStartingItems/constants";
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
  mod.saveDataManager("removeGloballyBannedItems", v);
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStartedFirst(): void {
  removeBannedItemsFromPools();
}

function removeBannedItemsFromPools() {
  const itemPool = game.GetItemPool();

  removeCollectibleFromPools(...BANNED_COLLECTIBLES);
  removeTrinketFromPools(...BANNED_TRINKETS);

  if (anyPlayerHasCollectible(CollectibleType.VOID)) {
    v.run.startedWithVoid = true;
    removeCollectibleFromPools(...BANNED_COLLECTIBLES_WITH_VOID);
  }

  if (inSeededRace()) {
    removeCollectibleFromPools(...BANNED_COLLECTIBLES_ON_SEEDED_RACES);
    removeTrinketFromPools(...BANNED_TRINKETS_ON_SEEDED_RACES);
  }

  // Tainted Magdalene is invincible with Sharp Plug.
  if (anyPlayerIs(PlayerType.MAGDALENE_B)) {
    itemPool.RemoveCollectible(CollectibleType.SHARP_PLUG);
  }
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStartedLast(): void {
  replaceEdenBannedItems();
}

/**
 * Mercurius and TMTRAINER have the "noeden" tag added in "items_metadata.xml", so we do not have to
 * worry about those.
 */
function replaceEdenBannedItems() {
  // The only items to worry about are the ones that are conditionally banned in seeded races.
  if (inSeededRace()) {
    return;
  }

  const edens = getPlayersOfType(PlayerType.EDEN, PlayerType.EDEN_B);
  for (const player of edens) {
    for (const collectibleType of BANNED_COLLECTIBLES_ON_SEEDED_RACES) {
      if (player.HasCollectible(collectibleType)) {
        player.RemoveCollectible(collectibleType);
        addNewRandomPassiveToEden(player);
      }
    }

    if (v.run.startedWithCompass) {
      addNewRandomPassiveToEden(player);
    }

    for (const trinketType of BANNED_TRINKETS_ON_SEEDED_RACES) {
      if (player.HasTrinket(trinketType)) {
        player.TryRemoveTrinket(trinketType);
        // (Do not reward them with a new trinket, since Eden does not always start with a trinket.)
      }
    }
  }
}

function addNewRandomPassiveToEden(player: EntityPlayer) {
  const replacementCollectibleType = getEdenReplacementCollectibleType(player);
  showEdenStartingItems.changeStartingPassiveItem(replacementCollectibleType);
  addCollectibleAndRemoveFromPools(player, replacementCollectibleType);
}

function getEdenReplacementCollectibleType(
  player: EntityPlayer,
): CollectibleType {
  const seeds = game.GetSeeds();
  const startSeed = seeds.GetStartSeed();
  const rng = newRNG(startSeed);

  let replacementCollectible: CollectibleType;
  do {
    replacementCollectible = mod.getRandomEdenPassiveCollectible(
      rng,
      PLACEHOLDER_COLLECTIBLE_TYPES,
    );
  } while (player.HasCollectible(replacementCollectible));

  return replacementCollectible;
}

// ModCallback.POST_USE_ITEM (3)
// CollectibleType.SPINDOWN_DICE (723)
export function postUseItemSpindownDice(): void {
  for (const collectible of getCollectibles()) {
    if (isBannedCollectible(collectible)) {
      // Skip over the banned collectible and turn it into the one before that.
      const previousCollectibleType = asCollectibleType(
        asNumber(collectible.SubType) - 1,
      );
      setCollectibleSubType(collectible, previousCollectibleType);
    }
  }
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  // Prevent getting banned items on the Death Certificate floor.
  for (const collectible of getCollectibles()) {
    if (isBannedCollectible(collectible)) {
      collectible.Remove();
    }
  }
}

function isBannedCollectible(collectible: EntityPickupCollectible) {
  if (BANNED_COLLECTIBLES.has(collectible.SubType)) {
    return true;
  }

  if (
    v.run.startedWithVoid &&
    BANNED_COLLECTIBLES_WITH_VOID.has(collectible.SubType)
  ) {
    return true;
  }

  if (inSeededRace()) {
    if (BANNED_COLLECTIBLES_ON_SEEDED_RACES.has(collectible.SubType)) {
      return true;
    }
  }

  if (
    anyPlayerIs(PlayerType.MAGDALENE_B) &&
    collectible.SubType === CollectibleType.SHARP_PLUG
  ) {
    return true;
  }

  return false;
}

export function setStartedWithCompass(): void {
  v.run.startedWithCompass = true;
}
