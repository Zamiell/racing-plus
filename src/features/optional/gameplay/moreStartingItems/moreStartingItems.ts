import { onRepentanceStage } from "isaacscript-common";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";
import { CollectibleTypeCustom } from "../../../../types/enums";
import { changeCollectibleSubType } from "../../../../utilCollectible";

const v = {
  run: {
    placeholdersRemoved: false,
  },

  level: {
    previouslyInTreasureRoom: false,
    currentlyInTreasureRoom: false,
  },
};

export const COLLECTIBLE_REPLACEMENT_MAP = new Map<
  CollectibleTypeCustom,
  CollectibleType
>([
  [
    CollectibleTypeCustom.COLLECTIBLE_MAGIC_MUSHROOM_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_SACRED_HEART_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_SACRED_HEART,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_DEATHS_TOUCH_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_DEATHS_TOUCH,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_JUDAS_SHADOW_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_JUDAS_SHADOW,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_GODHEAD_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_GODHEAD,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_INCUBUS_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_INCUBUS,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_MAW_OF_THE_VOID_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_MAW_OF_THE_VOID,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_CROWN_OF_LIGHT_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT,
  ],
  [
    CollectibleTypeCustom.COLLECTIBLE_TWISTED_PAIR_PLACEHOLDER,
    CollectibleType.COLLECTIBLE_TWISTED_PAIR,
  ],
]);

export function postNewLevel(): void {
  const stage = g.l.GetStage();

  // Ensure that the placeholders are removed beyond Basement 1
  // (placeholders are removed as soon as they enter the first Treasure Room,
  // but they might have skipped the Basement 1 Treasure Room for some reason)
  if (
    (stage >= 2 || (stage === 1 && onRepentanceStage())) &&
    !v.run.placeholdersRemoved
  ) {
    removePlaceholders();
  }
}

export function postGameStarted(): void {
  if (!config.extraStartingItems) {
    removePlaceholders();
  }
}

function removePlaceholders() {
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

export function postNewRoom(): void {
  const roomType = g.r.GetType();

  v.level.previouslyInTreasureRoom = v.level.currentlyInTreasureRoom;
  v.level.currentlyInTreasureRoom = roomType === RoomType.ROOM_TREASURE;

  if (v.level.previouslyInTreasureRoom && !v.run.placeholdersRemoved) {
    removePlaceholders();
  }

  rollDuplicateItems();
  replacePlaceholders();
}

export function postUpdate(): void {
  rollDuplicateItems();
  replacePlaceholders();
}

function replacePlaceholders() {
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );

  for (const collectible of collectibles) {
    if (collectible.SubType === CollectibleType.COLLECTIBLE_NULL) {
      // Ignore empty pedestals (i.e. items that have already been taken by the player)
      continue;
    }

    const newCollectible = COLLECTIBLE_REPLACEMENT_MAP.get(collectible.SubType);

    if (newCollectible !== undefined) {
      changeCollectibleSubType(collectible, newCollectible);
    }
  }
}

function rollDuplicateItems() {
  const startSeed = g.seeds.GetStartSeed();
  const foundDeathsTouch = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    CollectibleType.COLLECTIBLE_DEATHS_TOUCH,
  );
  const foundMagicMush = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM,
  );
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );

  for (const collectible of collectibles) {
    if (collectible.SubType === CollectibleType.COLLECTIBLE_NULL) {
      // Ignore empty pedestals (i.e. items that have already been taken by the player)
      continue;
    }

    if (
      foundDeathsTouch.length !== 0 &&
      collectible.SubType ===
        CollectibleTypeCustom.COLLECTIBLE_DEATHS_TOUCH_PLACEHOLDER
    ) {
      const newCollectible = g.itemPool.GetCollectible(
        ItemPoolType.POOL_TREASURE,
        true,
        startSeed,
      );

      changeCollectibleSubType(collectible, newCollectible);
    }

    if (
      foundMagicMush.length !== 0 &&
      collectible.SubType ===
        CollectibleTypeCustom.COLLECTIBLE_MAGIC_MUSHROOM_PLACEHOLDER
    ) {
      const newCollectible = g.itemPool.GetCollectible(
        ItemPoolType.POOL_TREASURE,
        true,
        startSeed,
      );

      changeCollectibleSubType(collectible, newCollectible);
    }
  }
}
