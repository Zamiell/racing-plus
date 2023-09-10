import { CardType, ModCallback } from "isaac-typescript-definitions";
import { Callback, getCollectibles } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { mod } from "../../../../mod";
import { postSpawnCheckpoint } from "../../../../speedrun/utilsSpeedrun";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

/**
 * Most of the Checkpoint-related protection code is in `PreserveCollectibles` class. However, we
 * also need to handle the case of using a black rune. (Unfortunately, we cannot cancel a black rune
 * usage since there is no `PRE_USE_CARD` callback.)
 */
export class PreserveCheckpoint extends MandatoryModFeature {
  // 5, 41
  @Callback(ModCallback.POST_USE_CARD, CardType.RUNE_BLACK)
  postUseCardBlackRune(): void {
    this.respawnCheckpoint();
  }

  respawnCheckpoint(): void {
    const checkpoints = getCollectibles(CollectibleTypeCustom.CHECKPOINT);
    for (const checkpoint of checkpoints) {
      // The Checkpoint custom item is about to be deleted, so spawn another one.
      const newCheckpoint = mod.spawnCollectible(
        CollectibleTypeCustom.CHECKPOINT,
        checkpoint.Position,
        checkpoint.InitSeed,
      );
      postSpawnCheckpoint(newCheckpoint);
    }
  }
}
