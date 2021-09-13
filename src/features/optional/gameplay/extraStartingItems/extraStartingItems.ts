import {
  changeCollectibleSubType,
  getEffectiveStage,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";
import { CollectibleTypeCustom } from "../../../../types/enums";
import { COLLECTIBLE_REPLACEMENT_MAP } from "./constants";

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
  rollDuplicateItems();
  replacePlaceholderItems();
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.extraStartingItems) {
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
  const deathsTouches = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    CollectibleType.COLLECTIBLE_DEATHS_TOUCH,
  );
  const foundDeathsTouch = deathsTouches.length > 0;
  const magicMushes = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM,
  );
  const foundMagicMush = magicMushes.length > 0;
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );

  for (const collectible of collectibles) {
    const pickup = collectible.ToPickup();
    if (pickup === undefined) {
      continue;
    }

    if (pickup.SubType === CollectibleType.COLLECTIBLE_NULL) {
      // Ignore empty pedestals (i.e. items that have already been taken by the player)
      continue;
    }

    if (
      foundDeathsTouch &&
      pickup.SubType ===
        CollectibleTypeCustom.COLLECTIBLE_DEATHS_TOUCH_PLACEHOLDER
    ) {
      const newCollectibleType = g.itemPool.GetCollectible(
        ItemPoolType.POOL_TREASURE,
        true,
        startSeed,
      );

      changeCollectibleSubType(pickup, newCollectibleType);
    }

    if (
      foundMagicMush &&
      pickup.SubType ===
        CollectibleTypeCustom.COLLECTIBLE_MAGIC_MUSHROOM_PLACEHOLDER
    ) {
      const newCollectibleType = g.itemPool.GetCollectible(
        ItemPoolType.POOL_TREASURE,
        true,
        startSeed,
      );

      changeCollectibleSubType(pickup, newCollectibleType);
    }
  }
}

function replacePlaceholderItems() {
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );

  for (const collectible of collectibles) {
    const pickup = collectible.ToPickup();
    if (pickup === undefined) {
      continue;
    }

    if (pickup.SubType === CollectibleType.COLLECTIBLE_NULL) {
      // Ignore empty pedestals (i.e. items that have already been taken by the player)
      continue;
    }

    const newCollectibleType = COLLECTIBLE_REPLACEMENT_MAP.get(pickup.SubType);

    if (newCollectibleType !== undefined) {
      changeCollectibleSubType(pickup, newCollectibleType);
    }
  }
}

function removePlaceholdersFromPools() {
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_MAGIC_MUSHROOM_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_SACRED_HEART_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_DEATHS_TOUCH_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_JUDAS_SHADOW_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_GODHEAD_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_INCUBUS_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_MAW_OF_THE_VOID_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_CROWN_OF_LIGHT_PLACEHOLDER,
  );
  g.itemPool.RemoveCollectible(
    CollectibleTypeCustom.COLLECTIBLE_TWISTED_PAIR_PLACEHOLDER,
  );

  v.run.placeholdersRemoved = true;
}
