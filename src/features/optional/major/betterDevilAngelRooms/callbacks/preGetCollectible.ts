import {
  CollectibleType,
  ItemPoolType,
  ItemType,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  getCollectibleName,
  giveTrinketsBack,
  inAngelShop,
  inGenesisRoom,
  itemConfig,
  log,
  temporarilyRemoveTrinket,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../../enums/CollectibleTypeCustom";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import v from "../v";

const MAX_GET_COLLECTIBLE_ATTEMPTS = 100;

export function betterDevilAngelRoomsPreGetCollectible(
  itemPoolType: ItemPoolType,
  _decrease: boolean,
  _seed: int,
): CollectibleType | undefined {
  if (!config.betterDevilAngelRooms) {
    return undefined;
  }

  if (v.run.gettingCollectible) {
    return undefined;
  }

  const gameFrameCount = g.g.GetFrameCount();
  const roomType = g.r.GetType();

  if (gameFrameCount === v.room.usedD4Frame) {
    return undefined;
  }

  if (
    itemPoolType !== ItemPoolType.DEVIL && // 3
    itemPoolType !== ItemPoolType.ANGEL // 4
  ) {
    return undefined;
  }

  // There is an unknown bug that causes collectibles in Genesis rooms to come from incorrect item
  // pools. Work around this by disabling this feature when the player is in a Genesis room.
  if (inGenesisRoom()) {
    return undefined;
  }

  // As soon as we enter a Devil Room or an Angel Room, vanilla collectibles may spawn before we
  // have had a chance to delete them. This will modify the item pool relating to the room. To
  // counteract this, replace all vanilla items with an arbitrary placeholder item, which should not
  // affect pools. The placeholder item will be deleted later on this frame.
  if (
    !v.level.vanillaCollectiblesHaveSpawnedInCustomRoom &&
    (roomType === RoomType.DEVIL || roomType === RoomType.ANGEL) &&
    !inAngelShop()
  ) {
    return CollectibleTypeCustom.DEBUG;
  }

  const collectibleTypeInOrder = getDevilOrAngelItemInOrder(itemPoolType);
  const collectibleName =
    collectibleTypeInOrder === undefined
      ? "Unknown"
      : getCollectibleName(collectibleTypeInOrder);
  log(
    `Custom Devil/Angel room in-order collectible: ${collectibleName} (${collectibleTypeInOrder})`,
  );
  return collectibleTypeInOrder;
}

function getDevilOrAngelItemInOrder(
  itemPoolType: ItemPoolType.DEVIL | ItemPoolType.ANGEL,
) {
  const player = Isaac.GetPlayer();

  // We need to account for the NO trinket; if the player has it, we need to temporarily remove it,
  // otherwise the random items selected will not be consistent.
  const trinketSituation = temporarilyRemoveTrinket(player, TrinketType.NO);

  // Only attempt to find a valid item for N iterations in case something goes wrong.
  for (let i = 0; i < MAX_GET_COLLECTIBLE_ATTEMPTS; i++) {
    v.run.gettingCollectible = true;
    const subType = getNewSubType(itemPoolType);
    v.run.gettingCollectible = false;

    // Simply return the new sub-type if we do not have the NO trinket.
    if (trinketSituation === undefined) {
      return subType;
    }

    // Otherwise, check to see if this is an active item.
    const itemConfigItem = itemConfig.GetCollectible(subType);
    if (itemConfigItem === undefined) {
      continue;
    }

    if (itemConfigItem.Type !== ItemType.ACTIVE) {
      // It is not an active item. Give the NO trinket back and return the new sub-type.
      giveTrinketsBack(player, trinketSituation);
      return subType;
    }
  }

  return undefined;
}

function getNewSubType(
  itemPoolType: ItemPoolType.DEVIL | ItemPoolType.ANGEL,
): CollectibleType {
  switch (itemPoolType) {
    // 3
    case ItemPoolType.DEVIL: {
      const seed = v.run.rng.devilCollectibles.Next();
      return g.itemPool.GetCollectible(itemPoolType, true, seed);
    }

    // 4
    case ItemPoolType.ANGEL: {
      const seed = v.run.rng.angelCollectibles.Next();
      return g.itemPool.GetCollectible(itemPoolType, true, seed);
    }
  }
}
