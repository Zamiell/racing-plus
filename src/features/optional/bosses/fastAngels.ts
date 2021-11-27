import {
  anyPlayerHasCollectible,
  anyPlayerHasTrinket,
  findFreePosition,
  spawnCollectible,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// The game only spawns key pieces from angels after the death animation is over
// This takes too long, so manually spawn the key pieces as soon as the angel dies
// This also prevents the situation where a player can leave the room before the death animation
// is finished and miss out on a key piece

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
  // Fallen Angels do not drop key pieces
  if (entity.Variant !== AngelVariant.NORMAL) {
    return;
  }

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
  const position = findFreePosition(entity.Position);
  const collectibleType = getKeySubType(entity);
  spawnCollectible(collectibleType, position, entity.InitSeed, false, true);
}

function getKeySubType(entity: Entity) {
  if (anyPlayerHasTrinket(TrinketType.TRINKET_FILIGREE_FEATHERS)) {
    // Even if the player has both key pieces,
    // Filigree Feather will still make an angel drop a random item
    return CollectibleType.COLLECTIBLE_NULL; // A random item
  }

  if (
    entity.Type === EntityType.ENTITY_URIEL &&
    !anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_1)
  ) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_1;
  }

  if (
    entity.Type === EntityType.ENTITY_GABRIEL &&
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
