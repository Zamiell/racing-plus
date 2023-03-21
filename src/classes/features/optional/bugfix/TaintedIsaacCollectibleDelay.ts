import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import {
  COLLECTIBLE_INITIAL_WAIT,
  Callback,
  DefaultMap,
  game,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const v = {
  room: {
    collectibleInitialFrames: new DefaultMap<PtrHash, int, [int]>(
      (gameFrameCount) => gameFrameCount,
    ),
  },
};

/** Make Tainted Isaac not automatically pick up pedestal items from chests. */
export class TaintedIsaacCollectibleDelay extends ConfigurableModFeature {
  configKey: keyof Config = "TaintedIsaacCollectibleDelay";
  v = v;

  // 35, 100
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.COLLECTIBLE)
  postPickupUpdateCollectible(pickup: EntityPickup): void {
    const collectible = pickup as EntityPickupCollectible;

    // We set custom "Wait" values for the checkpoint.
    if (collectible.SubType === CollectibleTypeCustom.CHECKPOINT) {
      return;
    }

    // The collectible's frame count will be reset to 0 every time that it is morphed as part of a
    // rotation. However, the PtrHash will not change when it is rotated. Thus, we need to keep
    // track of the frame that each collectible was initially spawned.
    const ptrHash = GetPtrHash(collectible);
    const gameFrameCount = game.GetFrameCount();
    const initialFrame = v.room.collectibleInitialFrames.getAndSetDefault(
      ptrHash,
      gameFrameCount,
    );

    // The "Wait" value will start at a constant value and tick downwards.
    const frameWaitOver = initialFrame + COLLECTIBLE_INITIAL_WAIT;
    const expectedWait = frameWaitOver - gameFrameCount;
    if (expectedWait <= 0 || expectedWait === collectible.Wait) {
      return;
    }

    // Don't exclusively select for Tainted Isaac, since e.g. Binge Eater can make rotating
    // pedestals. Instead, enforce standard wait values for all pedestals.
    collectible.Wait = expectedWait;
  }
}
