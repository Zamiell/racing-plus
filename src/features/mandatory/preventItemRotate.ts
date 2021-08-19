import {
  getItemName,
  isQuestItem,
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

// Keep specific items from being affected by the Glitched Crown, Binge Eater,
// and the Tainted Isaac switching mechanic
export function postUpdate(): void {
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );
  for (const collectible of collectibles) {
    if (collectible.SubType === CollectibleType.COLLECTIBLE_NULL) {
      // Ignore empty pedestals (i.e. items that have already been taken by the player)
      continue;
    }

    const trackedCollectibleType = v.room.trackedItems.get(
      collectible.InitSeed,
    );
    if (
      trackedCollectibleType !== undefined &&
      collectible.SubType !== trackedCollectibleType
    ) {
      // This item has switched, so restore it back to the way it was
      const oldSubType = collectible.SubType;
      changeCollectibleSubType(collectible, trackedCollectibleType);

      log(
        `Prevented pedestal item ${getItemName(
          trackedCollectibleType,
        )} from rotating to item ${getItemName(oldSubType)}.`,
      );
    }
  }
}

export function checkQuestItem(
  collectibleType: CollectibleType | CollectibleTypeCustom,
  seed: int,
): void {
  if (isQuestItem(collectibleType)) {
    v.room.trackedItems.set(seed, collectibleType);
  }
}
