// This callback is called when the game needs to get a new random item from an item pool
// It is undocumented, but you can return an integer from this callback in order to change the
// returned item subtype
// It is not called for "set" drops (like Mr. Boom from Wrath) and manually spawned items
// (like the Checkpoint)

/*
// ModCallbacks.MC_PRE_GET_COLLECTIBLE (62)
export function main(
  itemPoolType: ItemPoolType,
  _decrease: boolean,
  _seed: int,
): CollectibleType | null {
  if (g.run.gettingCollectible) {
    return null;
  }

  return seededRace(itemPoolType);
}

function seededRace(itemPoolType: ItemPoolType) {
  // Manually generate random items for specific item pools in seeded races
  if (
    g.race.format !== RaceStatus.SEEDED ||
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING ||
    (itemPoolType !== ItemPoolType.POOL_DEVIL && // 3
      itemPoolType !== ItemPoolType.POOL_ANGEL && // 4
      itemPoolType !== ItemPoolType.POOL_DEMON_BEGGAR) // 11
  ) {
    return null;
  }

  // We need to account for the NO! trinket;
  // if the player has it, we need to temporarily remove it,
  // otherwise the random items selected will not be consistent
  const hasTrinket = g.p.HasTrinket(TrinketType.TRINKET_NO);
  if (hasTrinket) {
    g.p.TryRemoveTrinket(TrinketType.TRINKET_NO);
  }

  // Only attempt to find a valid item for 100 iterations in case something goes wrong
  for (let i = 0; i < 100; i++) {
    g.run.gettingCollectible = true;
    const subType = getNewSubType(itemPoolType);
    g.run.gettingCollectible = false;
    if (subType === null) {
      return null;
    }

    // Simply return the new subtype if we do not have the NO! trinket
    if (!hasTrinket) {
      return subType;
    }

    // Otherwise, check to see if this is an active item
    const item = g.itemConfig.GetCollectible(subType);
    if (item.Type !== ItemType.ITEM_ACTIVE) {
      // It is not an active item
      // Give the NO! trinket back and return the new subtype
      g.p.AddTrinket(TrinketType.TRINKET_NO);
      return subType;
    }

    // It is an active item, so let the RNG increment && generate another random item
    Isaac.DebugString(
      `Skipping over item ${subType} since we have the NO! trinket.`,
    );
  }

  return null;
}

function getNewSubType(itemPoolType: ItemPoolType) {
  switch (itemPoolType) {
    // 3
    case ItemPoolType.POOL_DEVIL: {
      g.RNGCounter.devilRoomItem = misc.incrementRNG(
        g.RNGCounter.devilRoomItem,
      );
      return g.itemPool.GetCollectible(
        itemPoolType,
        true,
        g.RNGCounter.devilRoomItem,
      );
    }

    // 4
    case ItemPoolType.POOL_ANGEL: {
      g.RNGCounter.angelRoomItem = misc.incrementRNG(
        g.RNGCounter.angelRoomItem,
      );
      return g.itemPool.GetCollectible(
        itemPoolType,
        true,
        g.RNGCounter.angelRoomItem,
      );
    }

    // 11
    case ItemPoolType.POOL_DEMON_BEGGAR: {
      g.RNGCounter.devilRoomBeggar = misc.incrementRNG(
        g.RNGCounter.devilRoomBeggar,
      );
      return g.itemPool.GetCollectible(
        itemPoolType,
        true,
        g.RNGCounter.devilRoomBeggar,
      );
    }

    default: {
      error("Unknown item pool type.");
      return null;
    }
  }
}
*/
