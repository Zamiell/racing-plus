import {
  anyPlayerHasCollectible,
  findFreePosition,
  getRandomInt,
  spawnCollectible,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { RacerStatus } from "../../race/types/RacerStatus";
import { RaceStatus } from "../../race/types/RaceStatus";

// The game only spawns Krampus' drop after his death animation is over
// This takes too long, so manually spawn the drop as soon as Krampus dies
// This also prevents the situation where a player can leave the room before the death animation
// is finished and miss out on a drop

// ModCallbacks.MC_POST_PICKUP_INIT (34)
// PickupVariant.PICKUP_COLLECTIBLE (100)
export function postPickupInitCollectible(pickup: EntityPickup): void {
  checkRemoveVanillaKrampusDrop(pickup);
}

function checkRemoveVanillaKrampusDrop(pickup: EntityPickup) {
  // There is no need to check for the collectible type since the only situation where a Fallen NPC
  // can drop a collectible is Krampus dropping A Lump of Coal or Krampus' Head
  if (pickup.SpawnerType === EntityType.ENTITY_FALLEN) {
    pickup.Remove();
  }
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
// EntityType.ENTITY_FALLEN (81)
export function postEntityKillFallen(entity: Entity): void {
  if (!config.fastKrampus) {
    return;
  }

  if (entity.Variant === FallenVariant.KRAMPUS) {
    spawnKrampusDrop(entity);
  }
}

function spawnKrampusDrop(entity: Entity) {
  // Spawn the item
  const position = findFreePosition(entity.Position);
  spawnCollectible(getKrampusItemSubType(), position, entity.InitSeed);
}

function getKrampusItemSubType() {
  // Normally, Krampus has a 50% chance of dropping A Lump of Coal and a 50% chance of dropping
  // Krampus' Head
  // However, we might be in a special situation where we should always spawn one or the other
  const startSeed = g.seeds.GetStartSeed();

  const [coalBanned, headBanned] = getKrampusBans();

  if (coalBanned && headBanned) {
    // Since both of the items are banned, make Krampus drop a random Devil Room item
    return g.itemPool.GetCollectible(ItemPoolType.POOL_DEVIL, true, startSeed);
  }

  if (coalBanned) {
    return CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS;
  }

  if (headBanned) {
    return CollectibleType.COLLECTIBLE_LUMP_OF_COAL;
  }

  getRandomInt(1, 2, startSeed);
  const seededChoice = math.random(1, 2);
  const coal = seededChoice === 1;
  if (coal) {
    return CollectibleType.COLLECTIBLE_LUMP_OF_COAL;
  }

  return CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS;
}

function getKrampusBans() {
  // We want Krampus' drops to be explicitly contingent upon the items that player 1 has
  let coalBanned = false;
  let headBanned = false;

  if (anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_LUMP_OF_COAL)) {
    coalBanned = true;
  }

  if (anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS)) {
    headBanned = true;
  }

  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING
  ) {
    if (
      g.race.startingItems.includes(CollectibleType.COLLECTIBLE_LUMP_OF_COAL)
    ) {
      coalBanned = true;
    }
    if (
      g.race.startingItems.includes(CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS)
    ) {
      headBanned = true;
    }
  }

  return [coalBanned, headBanned];
}
