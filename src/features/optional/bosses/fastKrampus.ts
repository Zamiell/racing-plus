// The game only spawns Krampus' drop after his death animation is over. This takes too long, so
// manually spawn the drop as soon as Krampus dies. This also prevents the situation where a player
// can leave the room before the death animation is finished and miss out on a drop.

import {
  CollectibleType,
  EntityType,
  FallenVariant,
  ItemPoolType,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  findFreePosition,
  getCollectibleName,
  getRandom,
  log,
  newRNG,
  nextSeed,
  saveDataManager,
  spawnCollectible,
} from "isaacscript-common";
import { RacerStatus } from "../../../enums/RacerStatus";
import { RaceStatus } from "../../../enums/RaceStatus";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

const v = {
  run: {
    /**
     * We cannot use "entity.InitSeed" as the seed for keys because it will cause bugs with the
     * "preventItemRotate" feature of the standard library.
     */
    collectibleRNG: newRNG(),
  },
};

export function init(): void {
  saveDataManager("fastKrampus", v, featureEnabled);
}

function featureEnabled() {
  return config.fastAngels;
}

// ModCallback.POST_PICKUP_INIT (34)
// PickupVariant.COLLECTIBLE (100)
export function postPickupInitCollectible(
  collectible: EntityPickupCollectible,
): void {
  checkRemoveVanillaKrampusDrop(collectible);
}

function checkRemoveVanillaKrampusDrop(collectible: EntityPickupCollectible) {
  // There is no need to check for the collectible type since the only situation where a Fallen NPC
  // can drop a collectible is Krampus dropping A Lump of Coal or Krampus' Head.
  if (collectible.SpawnerType === EntityType.FALLEN) {
    collectible.Remove();
    log("Removed a vanilla Krampus drop.");
  }
}

// ModCallback.POST_ENTITY_KILL (68)
// EntityType.FALLEN (81)
export function postEntityKillFallen(entity: Entity): void {
  if (!config.fastKrampus) {
    return;
  }

  if (entity.Variant === (FallenVariant.KRAMPUS as int)) {
    spawnKrampusDrop(entity);
  }
}

function spawnKrampusDrop(entity: Entity) {
  const collectibleType = getKrampusItemSubType();
  const position = findFreePosition(entity.Position);

  spawnCollectible(
    collectibleType,
    position,
    v.run.collectibleRNG,
    false,
    true,
  );

  const collectibleName = getCollectibleName(collectibleType);
  log(`Spawned fast-Krampus item: ${collectibleName} (${collectibleType})`);
}

function getKrampusItemSubType() {
  // Normally, Krampus has a 50% chance of dropping A Lump of Coal and a 50% chance of dropping
  // Krampus' Head. However, we might be in a special situation where we should always spawn one or
  // the other.
  const startSeed = g.seeds.GetStartSeed();

  const [coalBanned, headBanned] = getKrampusBans();

  if (coalBanned && headBanned) {
    // Since both of the items are banned, make Krampus drop a random Devil Room item.
    return g.itemPool.GetCollectible(ItemPoolType.DEVIL, true, startSeed);
  }

  if (coalBanned) {
    return CollectibleType.HEAD_OF_KRAMPUS;
  }

  if (headBanned) {
    return CollectibleType.LUMP_OF_COAL;
  }

  // We want to use the starting seed of the run as a base for the random check, but if we use the
  // starting seed without iterating it, coal will always drop in seeded races. This is because the
  // `consistentDevilAngelRooms` feature only selects Devil Rooms 50% of the time.
  const seed = nextSeed(startSeed);
  const chance = getRandom(seed);
  const shouldGetCoal = chance < 0.5;

  return shouldGetCoal
    ? CollectibleType.LUMP_OF_COAL
    : CollectibleType.HEAD_OF_KRAMPUS;
}

function getKrampusBans(): [coalBanned: boolean, headBanned: boolean] {
  // We want Krampus' drops to be explicitly contingent upon the items that the player has.
  let coalBanned = false;
  let headBanned = false;

  if (anyPlayerHasCollectible(CollectibleType.LUMP_OF_COAL)) {
    coalBanned = true;
  }

  if (anyPlayerHasCollectible(CollectibleType.HEAD_OF_KRAMPUS)) {
    headBanned = true;
  }

  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING
  ) {
    if (g.race.startingItems.includes(CollectibleType.LUMP_OF_COAL)) {
      coalBanned = true;
    }
    if (g.race.startingItems.includes(CollectibleType.HEAD_OF_KRAMPUS)) {
      headBanned = true;
    }
  }

  return [coalBanned, headBanned];
}
