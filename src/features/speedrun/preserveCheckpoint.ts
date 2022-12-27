import { EntityType, PickupVariant } from "isaac-typescript-definitions";
import { countEntities, getCollectibles } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { mod } from "../../mod";
import { postSpawnCheckpoint } from "./speedrun";

// ModCallback.POST_USE_ITEM (3)
// CollectibleType.VOID (477)
export function postUseItemVoid(): void {
  respawnCheckpoint();
}

// ModCallback.POST_USE_CARD (5)
// Card.RUNE_BLACK (41)
export function useCardBlackRune(): void {
  respawnCheckpoint();
}

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.D6 (105)
export function preUseItemD6(player: EntityPlayer): boolean | undefined {
  // Prevent using the D6 if there are one or more Checkpoints in the room.
  const numCheckpoints = countEntities(
    EntityType.PICKUP,
    PickupVariant.COLLECTIBLE,
    CollectibleTypeCustom.CHECKPOINT,
  );
  if (numCheckpoints > 0) {
    player.AnimateSad();
    return true;
  }

  return undefined;
}

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.MOVING_BOX (523)
export function preUseItemMovingBox(player: EntityPlayer): boolean | undefined {
  // Use the same logic as the normal D6.
  return preUseItemD6(player);
}

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.ETERNAL_D6 (609)
export function preUseItemEternalD6(player: EntityPlayer): boolean | undefined {
  // Use the same logic as the normal D6.
  return preUseItemD6(player);
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
