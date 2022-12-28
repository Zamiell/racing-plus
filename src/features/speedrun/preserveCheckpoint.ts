import { getCollectibles } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { mod } from "../../mod";
import { postSpawnCheckpoint } from "./speedrun";

// ModCallback.POST_USE_CARD (5)
// Card.RUNE_BLACK (41)
export function useCardBlackRune(): void {
  respawnCheckpoint();
}

function respawnCheckpoint() {
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
