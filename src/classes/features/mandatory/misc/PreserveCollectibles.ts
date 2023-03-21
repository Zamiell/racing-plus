import {
  CollectibleType,
  EntityType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import { Callback, ReadonlySet, doesEntityExist } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import { inRoomWithSeason4StoredItems } from "../../speedrun/Season4";

const DANGEROUS_COLLECTIBLE_TYPES = new ReadonlySet([
  CollectibleType.D6, // 105
  CollectibleType.VOID, // 477
  CollectibleType.MOVING_BOX, // 523
  CollectibleType.ETERNAL_D6, // 609
  CollectibleType.ABYSS, // 706
  CollectibleType.SPINDOWN_DICE, // 723
]);

/**
 * Prevent deleting collectibles under certain conditions.
 *
 * Used to preserve the Checkpoint and the collectibles in the starting room of season 4.
 */
export class PreserveCollectibles extends MandatoryModFeature {
  @Callback(ModCallback.PRE_USE_ITEM)
  preUseItem(
    collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    if (this.shouldCancelDangerousCollectible(collectibleType)) {
      player.AnimateSad();
      return true;
    }

    return undefined;
  }

  shouldCancelDangerousCollectible(collectibleType: CollectibleType): boolean {
    if (!DANGEROUS_COLLECTIBLE_TYPES.has(collectibleType)) {
      return false;
    }

    const checkpointExists = doesEntityExist(
      EntityType.PICKUP,
      PickupVariant.COLLECTIBLE,
      CollectibleTypeCustom.CHECKPOINT,
    );

    return checkpointExists || inRoomWithSeason4StoredItems();
  }
}
