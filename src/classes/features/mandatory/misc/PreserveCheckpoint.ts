import { CardType, ModCallback } from "isaac-typescript-definitions";
import { Callback, getCollectibles } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { mod } from "../../../../mod";
import { postSpawnCheckpoint } from "../../../../speedrun/utilsSpeedrun";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

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
