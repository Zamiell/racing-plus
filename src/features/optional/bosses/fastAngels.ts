// The game only spawns key pieces from angels after the death animation is over
// This takes too long, so manually spawn the key pieces as soon as the angel dies
// This also prevents the situation where a player can leave the room before the death animation
// is finished and miss out on a key piece

import {
  anyPlayerHasCollectible,
  anyPlayerHasTrinket,
  countEntities,
  findFreePosition,
  spawnCollectible,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_POST_PICKUP_INIT (34)
// PickupVariant.PICKUP_COLLECTIBLE (100)
export function postPickupInitCollectible(pickup: EntityPickup): void {
  checkRemoveVanillaAngelDrop(pickup);
}

function checkRemoveVanillaAngelDrop(pickup: EntityPickup) {
  // We don't check for the collectible type in case the player has Filigree Feather
  if (
    pickup.SpawnerType === EntityType.ENTITY_URIEL || // 271
    pickup.SpawnerType === EntityType.ENTITY_GABRIEL // 272
  ) {
    pickup.Remove();
  }
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
// EntityType.ENTITY_URIEL (271)
export function postEntityKillUriel(entity: Entity): void {
  if (!config.fastAngels) {
    return;
  }

  spawnKeyPiece(entity);
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
// EntityType.ENTITY_GABRIEL (272)
export function postEntityKillGabriel(entity: Entity): void {
  if (!config.fastAngels) {
    return;
  }

  spawnKeyPiece(entity);
}

function spawnKeyPiece(entity: Entity) {
  if (!shouldSpawnKeyPiece(entity)) {
    return;
  }

  // Spawn the item
  // (in vanilla, on Tainted Keeper, for Filigree Feather items, the item is always free)
  // We use the start seed instead of "entity.InitSeed" so that the code remains consistent with the
  // "fastKrampus" feature code
  const startSeed = g.seeds.GetStartSeed();
  const position = findFreePosition(entity.Position);
  const collectibleType = getKeySubType(entity);
  spawnCollectible(collectibleType, position, startSeed, false, true);
}

function shouldSpawnKeyPiece(entity: Entity) {
  const roomType = g.r.GetType();

  // Fallen Angels do not drop key pieces
  if (entity.Variant !== AngelVariant.NORMAL) {
    return false;
  }

  // We don't want to drop key pieces from angels in Victory Lap bosses or the Boss Rush
  if (
    roomType !== RoomType.ROOM_SUPERSECRET && // 8
    roomType !== RoomType.ROOM_SACRIFICE && // 13
    roomType !== RoomType.ROOM_ANGEL // 15
  ) {
    // Key pieces dropping from angels in non-Angel Rooms was introduced in Booster Pack 4
    return false;
  }

  // Do not drop any key pieces if the player already has both of them
  // (this matches the behavior of vanilla)
  if (
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_1) && // 238
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_2) && // 239
    !anyPlayerHasTrinket(TrinketType.TRINKET_FILIGREE_FEATHERS) // 123
  ) {
    return false;
  }

  return true;
}

function getKeySubType(entity: Entity) {
  const hasFiligreeFeather = anyPlayerHasTrinket(
    TrinketType.TRINKET_FILIGREE_FEATHERS,
  );
  const hasKeyPiece1 = anyPlayerHasCollectible(
    CollectibleType.COLLECTIBLE_KEY_PIECE_1,
  );
  const hasKeyPiece2 = anyPlayerHasCollectible(
    CollectibleType.COLLECTIBLE_KEY_PIECE_2,
  );
  const numKeyPiece1 = countEntities(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    CollectibleType.COLLECTIBLE_KEY_PIECE_1,
  );
  const keyPiece1Spawned = numKeyPiece1 > 0;
  const numKeyPiece2 = countEntities(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    CollectibleType.COLLECTIBLE_KEY_PIECE_2,
  );
  const keyPiece2Spawned = numKeyPiece2 > 0;

  // First, handle the special case of the Filigree Feather trinket
  if (hasFiligreeFeather) {
    // Even if the player has both key pieces,
    // Filigree Feather will still make an angel drop a random item
    return CollectibleType.COLLECTIBLE_NULL; // A random item
  }

  // Second, try to assign key pieces based on the type of angel that was killed
  if (
    entity.Type === EntityType.ENTITY_URIEL &&
    !hasKeyPiece1 &&
    !keyPiece1Spawned
  ) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_1;
  }

  if (
    entity.Type === EntityType.ENTITY_GABRIEL &&
    !hasKeyPiece2 &&
    !keyPiece2Spawned
  ) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_2;
  }

  // Third, try to assign key pieces based on what the players have already
  if (hasKeyPiece1) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_2;
  }

  if (hasKeyPiece2) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_1;
  }

  // Fourth, try to assign key pieces based on the ones that are already dropped
  // (from fighting multiple angels in the same room)
  if (keyPiece1Spawned) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_2;
  }

  if (keyPiece2Spawned) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_1;
  }

  // Spawn key piece 1 by default
  return CollectibleType.COLLECTIBLE_KEY_PIECE_1;
}
