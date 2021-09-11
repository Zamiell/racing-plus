import {
  anyPlayerHasCollectible,
  anyPlayerHasTrinket,
} from "isaacscript-common";
import g from "../../../../globals";
import { findFreePosition, spawnCollectible } from "../../../../utilGlobals";

// ModCallbacks.MC_POST_ENTITY_KILL (68)
export function postEntityKill(npc: EntityNPC): void {
  spawnKeyPiece(npc);
}

function spawnKeyPiece(npc: EntityNPC) {
  // The game only spawns key pieces from angels after the death animation is over
  // This takes too long, so manually spawn the key pieces as soon as the angel dies
  // This also prevents the situation where a player can leave the room before the death animation
  // is finished and miss out on a key piece
  const roomType = g.r.GetType();

  // We don't want to drop key pieces from angels in Victory Lap bosses or the Boss Rush
  if (
    roomType !== RoomType.ROOM_SUPERSECRET && // 8
    roomType !== RoomType.ROOM_SACRIFICE && // 13
    roomType !== RoomType.ROOM_ANGEL // 15
  ) {
    // Key pieces dropping from angels in non-Angel Rooms was introduced in Booster Pack 4
    return;
  }

  // Do not drop any key pieces if the player already has both of them
  // (this matches the behavior of vanilla)
  if (
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_1) && // 238
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_2) && // 239
    !anyPlayerHasTrinket(TrinketType.TRINKET_FILIGREE_FEATHERS) // 123
  ) {
    return;
  }

  // Spawn the item
  // (in vanilla, on Tainted Keeper, for Filigree Feather items, the item is always free)
  const position = findFreePosition(npc.Position);
  spawnCollectible(getKeySubType(npc), position, npc.InitSeed, false, true);
}

function getKeySubType(npc: EntityNPC) {
  if (anyPlayerHasTrinket(TrinketType.TRINKET_FILIGREE_FEATHERS)) {
    // Even if the player has both key pieces,
    // Filigree Feather will still make an angel drop a random item
    return CollectibleType.COLLECTIBLE_NULL; // A random item
  }

  if (
    npc.Type === EntityType.ENTITY_URIEL &&
    !anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_1)
  ) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_1;
  }

  if (
    npc.Type === EntityType.ENTITY_GABRIEL &&
    !anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_2)
  ) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_2;
  }

  // In vanilla, angels will always drop their respective key piece
  // Since it is possible on Racing+ for two of the same angel to spawn,
  // ensure that an angel will drop the other key piece instead of dropping nothing
  if (anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_1)) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_2;
  }

  if (anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_2)) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_1;
  }

  // Spawn key piece 1 by default
  return CollectibleType.COLLECTIBLE_KEY_PIECE_1;
}