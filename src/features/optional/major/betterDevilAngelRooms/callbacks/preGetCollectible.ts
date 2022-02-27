import {
  giveTrinketsBack,
  inAngelShop,
  nextSeed,
  temporarilyRemoveTrinket,
} from "isaacscript-common";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import { CollectibleTypeCustom } from "../../../../../types/CollectibleTypeCustom";
import v from "../v";

const MAX_GET_COLLECTIBLE_ATTEMPTS = 100;

export function betterDevilAngelRoomsPreGetCollectible(
  itemPoolType: ItemPoolType,
  _decrease: boolean,
  _seed: int,
): CollectibleType | int | void {
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
    itemPoolType !== ItemPoolType.POOL_DEVIL && // 3
    itemPoolType !== ItemPoolType.POOL_ANGEL // 4
  ) {
    return undefined;
  }

  // As soon as we enter a Devil Room or an Angel Room,
  // vanilla items may spawn before we have had a chance to delete them
  // This will modify the item pool relating to the room
  // To counteract this, replace all vanilla items with an arbitrary placeholder item,
  // which should not affect pools
  // The placeholder item will be deleted later on this frame
  if (
    !v.level.vanillaCollectiblesHaveSpawnedInCustomRoom &&
    (roomType === RoomType.ROOM_DEVIL || roomType === RoomType.ROOM_ANGEL) &&
    !inAngelShop()
  ) {
    return CollectibleTypeCustom.COLLECTIBLE_MAGIC_MUSHROOM_PLACEHOLDER;
  }

  return getDevilOrAngelItemInOrder(itemPoolType);
}

function getDevilOrAngelItemInOrder(itemPoolType: ItemPoolType) {
  const player = Isaac.GetPlayer();

  // We need to account for the NO! trinket;
  // if the player has it, we need to temporarily remove it,
  // otherwise the random items selected will not be consistent
  const trinketSituation = temporarilyRemoveTrinket(
    player,
    TrinketType.TRINKET_NO,
  );

  // Only attempt to find a valid item for 100 iterations in case something goes wrong
  for (let i = 0; i < MAX_GET_COLLECTIBLE_ATTEMPTS; i++) {
    v.run.gettingCollectible = true;
    const subType = getNewSubType(itemPoolType);
    v.run.gettingCollectible = false;

    // Simply return the new sub-type if we do not have the NO! trinket
    if (trinketSituation === undefined) {
      return subType;
    }

    // Otherwise, check to see if this is an active item
    const itemConfigItem = g.itemConfig.GetCollectible(subType);
    if (itemConfigItem === undefined) {
      continue;
    }

    if (itemConfigItem.Type !== ItemType.ITEM_ACTIVE) {
      // It is not an active item
      // Give the NO! trinket back and return the new sub-type
      giveTrinketsBack(player, trinketSituation);
      return subType;
    }
  }

  return undefined;
}

function getNewSubType(itemPoolType: ItemPoolType) {
  switch (itemPoolType) {
    // 3
    case ItemPoolType.POOL_DEVIL: {
      v.run.seeds.devilCollectibles = nextSeed(v.run.seeds.devilCollectibles);
      return g.itemPool.GetCollectible(
        itemPoolType,
        true,
        v.run.seeds.devilCollectibles,
      );
    }

    // 4
    case ItemPoolType.POOL_ANGEL: {
      v.run.seeds.angelCollectibles = nextSeed(v.run.seeds.angelCollectibles);
      return g.itemPool.GetCollectible(
        itemPoolType,
        true,
        v.run.seeds.angelCollectibles,
      );
    }

    default: {
      error("Unknown item pool type.");
      return CollectibleType.COLLECTIBLE_NULL;
    }
  }
}
