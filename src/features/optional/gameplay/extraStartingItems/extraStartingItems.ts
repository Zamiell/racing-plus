import {
  CollectibleType,
  EntityType,
  ItemPoolType,
  PickupVariant,
  RoomType,
} from "isaac-typescript-definitions";
import {
  countEntities,
  getCollectibles,
  getEffectiveStage,
  saveDataManager,
  setCollectibleSubType,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";
import { shouldBanFirstFloorTreasureRoom } from "../../../mandatory/banFirstFloorRoomType";
import {
  COLLECTIBLE_REPLACEMENT_MAP,
  PLACEHOLDER_COLLECTIBLE_TYPES,
} from "./constants";

const v = {
  run: {
    placeholdersRemoved: false,
  },
};

export function init(): void {
  saveDataManager("extraStartingItems", v);
}

function shouldGetExtraStartingItems() {
  // If the player is not supposed to get a Treasure Room on the first floor, then they do not need
  // to get extra items inserted into the Treasure Room pool.
  return !shouldBanFirstFloorTreasureRoom();
}

// ModCallback.POST_UPDATE (1)
export function postUpdate(): void {
  if (!config.extraStartingItems) {
    return;
  }

  rollDuplicateItems();
  replacePlaceholderItems();
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.extraStartingItems) {
    return;
  }

  if (!shouldGetExtraStartingItems()) {
    removePlaceholdersFromPools();
  }
}

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  if (!config.extraStartingItems) {
    return;
  }

  const effectiveStage = getEffectiveStage();

  // Ensure that the placeholders are removed beyond Basement 1. Placeholders are removed as soon as
  // the player exits the first Treasure Room, but they might have skipped the Basement 1 Treasure
  // Room for some reason.
  if (effectiveStage >= 2 && !v.run.placeholdersRemoved) {
    removePlaceholdersFromPools();
  }
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.extraStartingItems) {
    return;
  }

  if (!v.run.placeholdersRemoved) {
    const lastRoomDesc = g.l.GetLastRoomDesc();
    const lastRoomData = lastRoomDesc.Data;
    if (
      lastRoomData !== undefined &&
      (lastRoomData.Type === RoomType.TREASURE ||
        // Tainted Keeper can find Treasure Room items in a shop.
        lastRoomData.Type === RoomType.SHOP)
    ) {
      removePlaceholdersFromPools();
    }
  }

  rollDuplicateItems();
  replacePlaceholderItems();
}

function rollDuplicateItems() {
  const startSeed = g.seeds.GetStartSeed();

  const numDeathTouches = countEntities(
    EntityType.PICKUP,
    PickupVariant.COLLECTIBLE,
    CollectibleType.DEATHS_TOUCH,
  );
  const deathsTouchExists = numDeathTouches > 0;

  const numMagicMushrooms = countEntities(
    EntityType.PICKUP,
    PickupVariant.COLLECTIBLE,
    CollectibleType.MAGIC_MUSHROOM,
  );
  const magicMushroomExists = numMagicMushrooms > 0;

  for (const collectible of getCollectibles()) {
    // Ignore empty pedestals (i.e. items that have already been taken by the player).
    if (collectible.SubType === CollectibleType.NULL) {
      continue;
    }

    if (
      deathsTouchExists &&
      collectible.SubType === CollectibleTypeCustom.DEATHS_TOUCH_PLACEHOLDER
    ) {
      const newCollectibleType = g.itemPool.GetCollectible(
        ItemPoolType.TREASURE,
        true,
        startSeed,
      );

      setCollectibleSubType(collectible, newCollectibleType);
    }

    if (
      magicMushroomExists &&
      collectible.SubType === CollectibleTypeCustom.MAGIC_MUSHROOM_PLACEHOLDER
    ) {
      const newCollectibleType = g.itemPool.GetCollectible(
        ItemPoolType.TREASURE,
        true,
        startSeed,
      );

      setCollectibleSubType(collectible, newCollectibleType);
    }
  }
}

function replacePlaceholderItems() {
  for (const collectible of getCollectibles()) {
    // Ignore empty pedestals (i.e. items that have already been taken by the player).
    if (collectible.SubType === CollectibleType.NULL) {
      continue;
    }

    const newCollectibleType = COLLECTIBLE_REPLACEMENT_MAP.get(
      collectible.SubType,
    );
    if (newCollectibleType !== undefined) {
      setCollectibleSubType(collectible, newCollectibleType);
    }
  }
}

function removePlaceholdersFromPools() {
  for (const collectibleType of PLACEHOLDER_COLLECTIBLE_TYPES) {
    g.itemPool.RemoveCollectible(collectibleType);
  }

  v.run.placeholdersRemoved = true;
}
