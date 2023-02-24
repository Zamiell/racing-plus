import {
  EntityType,
  ItemPoolType,
  ModCallback,
  PickupVariant,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  doesEntityExist,
  game,
  getCollectibles,
  ModCallbackCustom,
  onFirstFloor,
  removeCollectibleFromPools,
  setCollectibleSubType,
} from "isaacscript-common";
import { shouldBanFirstFloorTreasureRoom } from "../../../../features/mandatory/banFirstFloorRoomType";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import {
  COLLECTIBLE_REPLACEMENT_MAP,
  PLACEHOLDER_COLLECTIBLE_TYPES,
} from "./extraStartingItems/constants";

const v = {
  run: {
    placeholdersRemoved: false,
  },
};

export class ExtraStartingItems extends ConfigurableModFeature {
  configKey: keyof Config = "ExtraStartingItems";
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    rollDuplicateItems();
    replacePlaceholderItems();
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (!this.shouldGetExtraStartingItems()) {
      removePlaceholdersFromPools();
    }
  }

  /**
   * If the player is not supposed to get a Treasure Room on the first floor, then they do not need
   * to get extra items inserted into the Treasure Room pool.
   */
  shouldGetExtraStartingItems(): boolean {
    return !shouldBanFirstFloorTreasureRoom();
  }

  /**
   * Ensure that the placeholders are removed beyond Basement 1. Placeholders are removed as soon as
   * the player exits the first Treasure Room, but they might have skipped the Basement 1 Treasure
   * Room for some reason.
   */
  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {
    if (!v.run.placeholdersRemoved && !onFirstFloor()) {
      removePlaceholdersFromPools();
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const level = game.GetLevel();

    if (!v.run.placeholdersRemoved) {
      const lastRoomDesc = level.GetLastRoomDesc();
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

  /**
   * It is possible for players to get the placeholder items via the D4 or Tainted Eden getting
   * damaged. This is because the placeholder items are in pools. Check for this case and try to
   * handle it.
   */
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const itemPool = game.GetItemPool();

    for (const [
      placeholderCollectibleType,
      collectibleType,
    ] of COLLECTIBLE_REPLACEMENT_MAP) {
      if (!player.HasCollectible(placeholderCollectibleType, true)) {
        continue;
      }

      player.RemoveCollectible(placeholderCollectibleType);
      itemPool.RemoveCollectible(placeholderCollectibleType);

      // Prevent the situation where the player uses a D4 to roll into both e.g. Magic Mushroom and
      // Magic Mushroom Placeholder.
      if (player.HasCollectible(collectibleType, true)) {
        continue;
      }

      player.AddCollectible(collectibleType);
      itemPool.RemoveCollectible(collectibleType);
    }
  }
}

function rollDuplicateItems() {
  const itemPool = game.GetItemPool();
  const seeds = game.GetSeeds();
  const startSeed = seeds.GetStartSeed();

  for (const [
    collectibleTypeCustom,
    collectibleTypeVanilla,
  ] of COLLECTIBLE_REPLACEMENT_MAP) {
    const vanillaCollectibleExists = doesEntityExist(
      EntityType.PICKUP,
      PickupVariant.COLLECTIBLE,
      collectibleTypeVanilla,
    );

    if (!vanillaCollectibleExists) {
      continue;
    }

    const placeholderCollectibles = getCollectibles(collectibleTypeCustom);
    for (const collectible of placeholderCollectibles) {
      const newCollectibleType = itemPool.GetCollectible(
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
    const newCollectibleType = COLLECTIBLE_REPLACEMENT_MAP.get(
      collectible.SubType,
    );
    if (newCollectibleType !== undefined) {
      setCollectibleSubType(collectible, newCollectibleType);
    }
  }
}

function removePlaceholdersFromPools() {
  removeCollectibleFromPools(...PLACEHOLDER_COLLECTIBLE_TYPES);
  v.run.placeholdersRemoved = true;
}
