// This feature is not configurable because it could change item pools and trinket pools,
// causing a seed to be different

import {
  anyPlayerHasCollectible,
  getTotalPlayerCollectibles,
  initRNG,
  log,
  onSetSeed,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";
import { incrementRNG } from "../../util";
import { findFreePosition } from "../../utilGlobals";

const v = {
  run: {
    seed: 0,
    seedDevilAngel: 0,
  },
};

export function init(): void {
  saveDataManager("seededDrops", v);
}

// MC_POST_GAME_STARTED (14)
export function postGameStarted(): void {
  initVariables();
  removeSeededItemsTrinkets();
}

function initVariables() {
  const startSeed = g.seeds.GetStartSeed();

  v.run.seed = startSeed;

  // We want to ensure that the second RNG counter does not overlap with the first one
  // (around 175 rooms are cleared in an average speedrun, so 500 is a reasonable upper limit)
  const rng = initRNG(startSeed);
  for (let i = 0; i < 500; i++) {
    rng.Next();
  }
  v.run.seedDevilAngel = rng.GetSeed();
}

function removeSeededItemsTrinkets() {
  if (onSetSeed()) {
    // Remove certain items and trinkets that change room drop calculation
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_LUCKY_FOOT); // 46
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_DAEMONS_TAIL); // 22
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_CHILDS_HEART); // 34
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_RUSTED_KEY); // 36
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_MATCH_STICK); // 41
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_LUCKY_TOE); // 42
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_SAFETY_CAP); // 44
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_ACE_SPADES); // 45
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_WATCH_BATTERY); // 72
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_NUH_UH); // 165
  }
}

// MC_PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): boolean | void {
  if (shouldSpawnSeededDrop()) {
    spawnSeededDrop();
    log("Manually spawned a seeded drop.");
    return true;
  }

  return undefined;
}

function shouldSpawnSeededDrop(): boolean {
  const roomType = g.r.GetType();

  return (
    onSetSeed() &&
    // Boss rooms will drop a pedestal item instead of a random pickup
    roomType !== RoomType.ROOM_BOSS &&
    // Room drops are not supposed to happen in crawlspaces
    roomType !== RoomType.ROOM_DUNGEON
  );
}

// Normally, room drops are based on the room's seed
// This is undesirable, since someone can go a wrong way in a seeded race and then get rewarded with
// an Emperor card that the other player does not get
// Thus, we overwrite the game's room drop system with one that manually spawns awards in order
// The following code is based on the game's internal logic, documented here:
// https://bindingofisaacrebirth.gamepedia.com/Room_Clear_Awards
// (it was reverse engineered by Blade)
// However, there is some major difference from vanilla
// We hard-code values of 0 luck so that room drops are completely consistent
// (otherwise, one player would be able to get a lucky Emperor card by using a Luck Up or Luck Down
// pill, for example)
// Furthermore, we ignore the following items, since we remove them from pools:
// Lucky Foot, Silver Dollar, Bloody Crown, Daemon's Tail, Child's Heart, Rusted Key, Match Stick,
// Lucky Toe, Safety Cap, Ace of Spades, Watch Battery, and Nuh Uh!
// (Old Capacitor does not need to be removed, since the Lil Battery chance is independent of the
// room drop)
function spawnSeededDrop(): void {
  const centerPos = g.r.GetCenterPos();
  const seed = getSeed();
  const rng = initRNG(seed);

  let pickupVariant = getPickupVariant(rng);

  // Contract From Below has a chance to either:
  // 1) increase the amount of pickups that drop
  // 2) or make nothing drop
  let pickupCount = 1;
  if (
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_CONTRACT_FROM_BELOW) &&
    pickupVariant !== PickupVariant.PICKUP_TRINKET
  ) {
    pickupCount =
      getTotalPlayerCollectibles(
        CollectibleType.COLLECTIBLE_CONTRACT_FROM_BELOW,
      ) + 1;

    // Nothing chance with:
    // 1 contract / 2 pickups: 0.44
    // 2 contracts / 3 pickups: 0.44 (base) (would be 0.3 otherwise)
    // 3 contracts / 4 pickups: 0.2
    // 4 contracts / 5 pickups: 0.13
    const nothingChance = 0.666 ^ pickupCount; // "math.pow()" does not exist in Isaac's Lua version
    if (nothingChance * 0.5 > rng.RandomFloat()) {
      pickupCount = 0;
    }
  }

  // Hard mode has a chance to remove a heart drop
  if (
    g.g.Difficulty === Difficulty.DIFFICULTY_HARD &&
    pickupVariant === PickupVariant.PICKUP_HEART
  ) {
    if (rng.RandomInt(100) >= 35) {
      pickupVariant = PickupVariant.PICKUP_NULL;
    }
  }

  // Broken Modem has a chance to increase the amount of pickups that drop
  if (pickupCount >= 1) {
    const numBrokenModems = getTotalPlayerCollectibles(
      CollectibleType.COLLECTIBLE_BROKEN_MODEM,
    );
    for (let i = 0; i < numBrokenModems; i++) {
      if (
        rng.RandomInt(4) === 0 &&
        (pickupVariant === PickupVariant.PICKUP_HEART || // 10
          pickupVariant === PickupVariant.PICKUP_COIN || // 20
          pickupVariant === PickupVariant.PICKUP_KEY || // 30
          pickupVariant === PickupVariant.PICKUP_BOMB || // 40
          pickupVariant === PickupVariant.PICKUP_GRAB_BAG) // 69
      ) {
        pickupCount += 1;
      }
    }
  }

  if (pickupCount > 0 && pickupVariant !== PickupVariant.PICKUP_NULL) {
    let subType = 0;
    for (let i = 1; i <= pickupCount; i++) {
      const position = findFreePosition(centerPos);
      const pickup = g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        pickupVariant,
        position,
        Vector.Zero,
        null,
        subType,
        rng.Next(),
      );

      // Pickups with a subtype of 0 can morph into the various kinds of other pickups
      // If we are spawning a 2nd copy of this pickup, make sure that it is the same type
      subType = pickup.SubType;
    }
  }
}

function getPickupVariant(rng: RNG) {
  // Get a random value between 0 and 1 that will determine what kind of reward we get
  const pickupPercent = rng.RandomFloat();

  // 22% chance for nothing to drop
  let pickupVariant = PickupVariant.PICKUP_NULL;
  if (pickupPercent > 0.22) {
    if (pickupPercent < 0.3) {
      // 7% chance for a card / trinket / pill
      if (rng.RandomInt(3) === 0) {
        // 7% * 33% = 2.3% chance
        pickupVariant = PickupVariant.PICKUP_TAROTCARD; // 300
      } else if (rng.RandomInt(2) === 0) {
        // 7% * 66% * 50% = 2.3% chance
        pickupVariant = PickupVariant.PICKUP_TRINKET; // 350
      } else {
        // 7% * 66% * 50% = 2.3% chance
        pickupVariant = PickupVariant.PICKUP_PILL; // 70
      }
    } else if (pickupPercent < 0.45) {
      // 15% for a coin
      pickupVariant = PickupVariant.PICKUP_COIN; // 20
    } else if (pickupPercent < 0.6) {
      // 15% for a heart
      pickupVariant = PickupVariant.PICKUP_HEART; // 10
    } else if (pickupPercent < 0.8) {
      // 20% for a key
      pickupVariant = PickupVariant.PICKUP_KEY; // 30
    } else if (pickupPercent < 0.95) {
      // 15% for a bomb
      pickupVariant = PickupVariant.PICKUP_BOMB; // 40
    } else {
      // 5% for a chest
      pickupVariant = PickupVariant.PICKUP_CHEST; // 50
    }

    if (rng.RandomInt(20) === 0) {
      pickupVariant = PickupVariant.PICKUP_LIL_BATTERY; // 90
    }

    if (rng.RandomInt(50) === 0) {
      pickupVariant = PickupVariant.PICKUP_GRAB_BAG; // 69
    }
  }

  return pickupVariant;
}

// Find out which seed we should use
// (Devil Rooms and Angel Rooms use a separate RNG counter so that players cannot get a lucky
// battery after killing an angel)
function getSeed() {
  const roomType = g.r.GetType();

  if (
    roomType === RoomType.ROOM_DEVIL || // 14
    roomType === RoomType.ROOM_ANGEL // 15
  ) {
    v.run.seedDevilAngel = incrementRNG(v.run.seedDevilAngel);
    return v.run.seedDevilAngel;
  }

  v.run.seed = incrementRNG(v.run.seed);
  return v.run.seed;
}
