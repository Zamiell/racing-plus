import {
  countEntities,
  getCollectibles,
  getEffectiveStage,
  saveDataManager,
  setCollectibleSubType,
} from "isaacscript-common";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";
import { CollectibleTypeCustom } from "../../../../types/CollectibleTypeCustom";
import { shouldBanFirstFloorTreasureRoom } from "../../../mandatory/banFirstFloorRoomType";
import {
  COLLECTIBLE_REPLACEMENT_MAP,
  PLACEHOLDER_COLLECTIBLES_SET,
} from "./constants";

const v = {
  run: {
    placeholdersRemoved: false,
  },
};

export function init(): void {
  saveDataManager("extraStartingItems", v);
}

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  if (!config.extraStartingItems) {
    return;
  }

  rollDuplicateItems();
  replacePlaceholderItems();
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.extraStartingItems) {
    return;
  }

  // If the player is not supposed to get a Treasure Room on the first floor, then the feature should not apply
  if (!shouldBanFirstFloorTreasureRoom()) {
    removePlaceholdersFromPools();
  }
}

// ModCallbacks.MC_POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const effectiveStage = getEffectiveStage();

  // Ensure that the placeholders are removed beyond Basement 1
  // Placeholders are removed as soon as the player exits the first Treasure Room,
  // but they might have skipped the Basement 1 Treasure Room for some reason
  if (effectiveStage >= 2 && !v.run.placeholdersRemoved) {
    removePlaceholdersFromPools();
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!v.run.placeholdersRemoved) {
    const lastRoomDesc = g.l.GetLastRoomDesc();
    const lastRoomData = lastRoomDesc.Data;
    if (
      lastRoomData !== undefined &&
      (lastRoomData.Type === RoomType.ROOM_TREASURE ||
        // Tainted Keeper can find Treasure Room items in a shop
        lastRoomData.Type === RoomType.ROOM_SHOP)
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
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    CollectibleType.COLLECTIBLE_DEATHS_TOUCH,
  );
  const deathsTouchExists = numDeathTouches > 0;

  const numMagicMushrooms = countEntities(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM,
  );
  const magicMushroomExists = numMagicMushrooms > 0;

  for (const collectible of getCollectibles()) {
    // Ignore empty pedestals (i.e. items that have already been taken by the player)
    if (collectible.SubType === CollectibleType.COLLECTIBLE_NULL) {
      continue;
    }

    if (
      deathsTouchExists &&
      collectible.SubType ===
        CollectibleTypeCustom.COLLECTIBLE_DEATHS_TOUCH_PLACEHOLDER
    ) {
      const newCollectibleType = g.itemPool.GetCollectible(
        ItemPoolType.POOL_TREASURE,
        true,
        startSeed,
      );

      setCollectibleSubType(collectible, newCollectibleType);
    }

    if (
      magicMushroomExists &&
      collectible.SubType ===
        CollectibleTypeCustom.COLLECTIBLE_MAGIC_MUSHROOM_PLACEHOLDER
    ) {
      const newCollectibleType = g.itemPool.GetCollectible(
        ItemPoolType.POOL_TREASURE,
        true,
        startSeed,
      );

      setCollectibleSubType(collectible, newCollectibleType);
    }
  }
}

function replacePlaceholderItems() {
  for (const collectible of getCollectibles()) {
    // Ignore empty pedestals (i.e. items that have already been taken by the player)
    if (collectible.SubType === CollectibleType.COLLECTIBLE_NULL) {
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
  for (const collectibleType of PLACEHOLDER_COLLECTIBLES_SET.values()) {
    g.itemPool.RemoveCollectible(collectibleType);
  }

  v.run.placeholdersRemoved = true;
}
