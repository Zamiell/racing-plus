import g from "../../globals";
import { CollectibleTypeCustom } from "../../types/enums";

// ModCallbacks.MC_USE_ITEM (3)
// CollectibleType.COLLECTIBLE_VOID (477)
export function useItemVoid(): void {
  respawnCheckpoint();
}

// ModCallbacks.MC_USE_CARD (5)
// Card.RUNE_BLACK (41)
export function useCardBlackRune(): void {
  respawnCheckpoint();
}

// ModCallbacks.MC_PRE_USE_ITEM (23)
// CollectibleType.COLLECTIBLE_D6 (105)
export function preUseItemD6(player: EntityPlayer): boolean | void {
  // The Checkpoint custom item is about to be deleted, so spawn another one
  const checkpoints = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
  );
  if (checkpoints.length > 0) {
    player.AnimateSad();
    return true;
  }

  return undefined;
}

function respawnCheckpoint() {
  const checkpoints = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
  );
  for (const checkpoint of checkpoints) {
    // The Checkpoint custom item is about to be deleted, so spawn another one
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_COLLECTIBLE,
      checkpoint.Position,
      checkpoint.Velocity,
      checkpoint.SpawnerEntity,
      CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
      checkpoint.InitSeed,
    );
  }
}
