// Keep specific items from being affected by the Glitched Crown, Binge Eater,
// and the Tainted Isaac switching mechanic

import {
  getItemName,
  isQuestCollectible,
  log,
  saveDataManager,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../types/enums";
import { changeCollectibleSubType } from "../../utilCollectible";

const v = {
  room: {
    /** Index is the InitSeed of the collectible. */
    trackedItems: new Map<int, CollectibleType | CollectibleTypeCustom>(),
  },
};

export function init(): void {
  saveDataManager("preventItemRotate", v);
}

// ModCallbacks.MC_USE_CARD (5)
// Card.CARD_SOUL_ISAAC (81)
export function useCardSoulOfIsaac(): void {
  // Soul of Isaac causes items to flip
  // Delete all tracked items (assuming that the player deliberately wants to roll a quest item)
  v.room.trackedItems.clear();
}

// ModCallbacks.MC_POST_PICKUP_UPDATE (35)
// PickupVariant.PICKUP_COLLECTIBLE (100)
export function postPickupUpdateCollectible(pickup: EntityPickup): void {
  if (pickup.SubType === CollectibleType.COLLECTIBLE_NULL) {
    // Ignore empty pedestals (i.e. items that have already been taken by the player)
    return;
  }

  const trackedCollectibleType = v.room.trackedItems.get(pickup.InitSeed);
  if (
    trackedCollectibleType !== undefined &&
    pickup.SubType !== trackedCollectibleType
  ) {
    // This item has switched, so restore it back to the way it was
    const oldSubType = pickup.SubType;
    changeCollectibleSubType(pickup, trackedCollectibleType);

    log(
      `Prevented pedestal item ${getItemName(
        trackedCollectibleType,
      )} from rotating to item ${getItemName(oldSubType)}.`,
    );
  }
}

export function checkQuestItem(
  pickup: EntityPickup,
  collectibleType: CollectibleType | CollectibleTypeCustom,
  seed: int,
): void {
  if (isQuestCollectible(collectibleType)) {
    v.room.trackedItems.set(seed, collectibleType);

    // The item might have already shifted on the first frame that it spawns,
    // so change it back if necessary
    postPickupUpdateCollectible(pickup);
  }
}
