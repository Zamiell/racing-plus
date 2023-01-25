// Used to preserve the Checkpoint and the collectibles in the starting room of season 4.

import { EntityType, PickupVariant } from "isaac-typescript-definitions";
import { doesEntityExist } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { inRoomWithSeason4StoredItems } from "./season4";

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.D6 (105)
export function preUseItemD6(player: EntityPlayer): boolean | undefined {
  return preUseItemDangerousCollectible(player);
}

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.VOID (477)
export function preUseItemVoid(player: EntityPlayer): boolean | undefined {
  return preUseItemDangerousCollectible(player);
}

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.MOVING_BOX (523)
export function preUseItemMovingBox(player: EntityPlayer): boolean | undefined {
  return preUseItemDangerousCollectible(player);
}

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.ETERNAL_D6 (609)
export function preUseItemEternalD6(player: EntityPlayer): boolean | undefined {
  return preUseItemDangerousCollectible(player);
}

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.ABYSS (706)
export function preUseItemAbyss(player: EntityPlayer): boolean | undefined {
  return preUseItemDangerousCollectible(player);
}

/** Prevent deleting collectibles under certain conditions. */
function preUseItemDangerousCollectible(
  player: EntityPlayer,
): boolean | undefined {
  if (shouldCancelDangerousCollectible()) {
    player.AnimateSad();
    return true;
  }

  return undefined;
}

function shouldCancelDangerousCollectible(): boolean {
  const checkpointExists = doesEntityExist(
    EntityType.PICKUP,
    PickupVariant.COLLECTIBLE,
    CollectibleTypeCustom.CHECKPOINT,
  );

  return checkpointExists || inRoomWithSeason4StoredItems();
}
