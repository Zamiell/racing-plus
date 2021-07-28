import g from "../../../../globals";
import { getRandom } from "../../../../util";
import {
  anyPlayerHasCollectible,
  spawnCollectible,
} from "../../../../utilGlobals";
import { deleteDyingEntity, getItemDropPosition } from "./util";

const DEATH_ANIMATION_LENGTH = 29;

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  deleteDyingEntity(
    EntityType.ENTITY_FALLEN,
    FallenVariant.KRAMPUS,
    DEATH_ANIMATION_LENGTH,
  );
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
export function postEntityKill(npc: EntityNPC): void {
  markDeathFrame(npc);
  spawnKrampusDrop(npc);
}

function markDeathFrame(npc: EntityNPC) {
  const gameFrameCount = g.g.GetFrameCount();
  const data = npc.GetData();
  data.killedFrame = gameFrameCount;
}

function spawnKrampusDrop(npc: EntityNPC) {
  // The game only spawns Krampus' drop after his death animation is over
  // This takes too long, so manually spawn the drop as soon as Krampus dies
  // This also prevents the situation where a player can leave the room before the death animation
  // is finished and miss out on a drop

  // Spawn the item
  spawnCollectible(
    getKrampusItemSubType(),
    getItemDropPosition(npc),
    npc.InitSeed,
    false,
  );
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

  getRandom(1, 2, startSeed);
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

  if (g.race.status === "in progress" && g.race.myStatus === "racing") {
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
