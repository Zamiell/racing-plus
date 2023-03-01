import {
  CollectibleType,
  EntityType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import { Callback, doesEntityExist } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import { inRoomWithSeason4StoredItems } from "../../speedrun/Season4";

/** Used to preserve the Checkpoint and the collectibles in the starting room of season 4. */
export class PreserveCollectibles extends MandatoryModFeature {
  // 23, 105
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.D6)
  preUseItemD6(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    return preUseItemDangerousCollectible(player);
  }

  // 23, 477
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.VOID)
  preUseItemVoid(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    return preUseItemDangerousCollectible(player);
  }

  // 23, 523
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.MOVING_BOX)
  preUseItemMovingBox(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    return preUseItemDangerousCollectible(player);
  }

  // 23, 609
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.ETERNAL_D6)
  preUseItemEternalD6(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    return preUseItemDangerousCollectible(player);
  }

  // 23, 706
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.ABYSS)
  preUseItemAbyss(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    return preUseItemDangerousCollectible(player);
  }

  // 23, 723
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.SPINDOWN_DICE)
  preUseItemSpindownDice(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    return preUseItemDangerousCollectible(player);
  }
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
