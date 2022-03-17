// The game only spawns Krampus' drop after his death animation is over
// This takes too long, so manually spawn the drop as soon as Krampus dies
// This also prevents the situation where a player can leave the room before the death animation
// is finished and miss out on a drop

import {
  anyPlayerHasCollectible,
  findFreePosition,
  getCollectibleName,
  getRandomInt,
  log,
  spawnCollectible,
} from "isaacscript-common";
import { RacerStatus } from "../../../enums/RacerStatus";
import { RaceStatus } from "../../../enums/RaceStatus";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

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
    log("Removed a vanilla Krampus drop.");
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
  const collectibleType = getKrampusItemSubType();
  const position = findFreePosition(entity.Position);

  // We cannot use "entity.InitSeed" as the seed because it will cause bugs with the
  // "preventItemRotate" feature of the standard library
  // For angels, we use a variable to keep track of the seed to use
  // For Krampus, we can always use the start seed because there should only ever be one Krampus
  // drop per run
  const startSeed = g.seeds.GetStartSeed();

  spawnCollectible(collectibleType, position, startSeed, false, true);

  const collectibleName = getCollectibleName(collectibleType);
  log(`Spawned fast-Krampus item: ${collectibleName} (${collectibleType})`);
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

  const seededChoice = getRandomInt(1, 2, startSeed);
  const coal = seededChoice === 1;
  return coal
    ? CollectibleType.COLLECTIBLE_LUMP_OF_COAL
    : CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS;
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
