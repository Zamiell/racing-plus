// This feature is not configurable because it could change item pools and trinket pools, causing a
// seed to be different.

import {
  CollectibleType,
  Difficulty,
  PickupVariant,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  findFreePosition,
  game,
  getTotalPlayerCollectibles,
  log,
  newRNG,
  onSetSeed,
  repeat,
  saveDataManager,
  setAllRNGToStartSeed,
  spawnPickupWithSeed,
} from "isaacscript-common";
import g from "../../globals";

const v = {
  run: {
    rng: {
      normalRooms: newRNG(),

      /**
       * Devil Rooms and Angel Rooms use a separate RNG counter so that players cannot get a lucky
       * battery after killing an angel.
       */
      devilAngel: newRNG(),
    },
  },
};

export function init(): void {
  saveDataManager("seededDrops", v);
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  initRNG();
  removeSeededItemsTrinkets();
}

function initRNG() {
  setAllRNGToStartSeed(v.run.rng);

  // We want to ensure that the RNG object for Devil Rooms and Angel Rooms does not overlap with the
  // normal one. (Around 175 rooms are cleared in an average speedrun, so 500 is a reasonable upper
  // limit.)
  repeat(500, () => {
    v.run.rng.devilAngel.Next();
  });
}

function removeSeededItemsTrinkets() {
  if (onSetSeed()) {
    // Remove certain items and trinkets that change room drop calculation.
    g.itemPool.RemoveCollectible(CollectibleType.LUCKY_FOOT); // 46
    g.itemPool.RemoveTrinket(TrinketType.DAEMONS_TAIL); // 22
    g.itemPool.RemoveTrinket(TrinketType.CHILDS_HEART); // 34
    g.itemPool.RemoveTrinket(TrinketType.RUSTED_KEY); // 36
    g.itemPool.RemoveTrinket(TrinketType.MATCH_STICK); // 41
    g.itemPool.RemoveTrinket(TrinketType.LUCKY_TOE); // 42
    g.itemPool.RemoveTrinket(TrinketType.SAFETY_CAP); // 44
    g.itemPool.RemoveTrinket(TrinketType.ACE_SPADES); // 45
    g.itemPool.RemoveTrinket(TrinketType.WATCH_BATTERY); // 72
    g.itemPool.RemoveTrinket(TrinketType.NUH_UH); // 165
  }
}

// MC_PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): boolean | undefined {
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
    // Boss rooms will drop a pedestal item instead of a random pickup.
    roomType !== RoomType.BOSS &&
    // The Boss Rush will drop a pedestal item when it is cleared.
    roomType !== RoomType.BOSS_RUSH &&
    // In vanilla, room drops will never occur in crawl spaces, even with 50 luck.
    roomType !== RoomType.DUNGEON
  );
}

/**
 * Normally, room drops are based on the room's seed. This is undesirable, since someone can go a
 * wrong way in a seeded race and then get rewarded with an Emperor card that the other player does
 * not get.
 *
 * Thus, we overwrite the game's room drop system with one that manually spawns awards in order. The
 * following code is based on the game's internal logic, documented here, which was reverse
 * engineered by Blade:
 *
 * https://bindingofisaacrebirth.gamepedia.com/Room_Clear_Awards
 *
 * However, we implement this algorithm differently from vanilla.
 *
 * First, we hard-code values of 0 luck so that room drops are completely consistent. (Otherwise,
 * one player would be able to get a lucky Emperor card by using a Luck Up or Luck Down pill, for
 * example.)
 *
 * Second, we ignore the following items, since we remove them from pools:
 *
 * - Daemon's Tail (22)
 * - Child's Heart (34)
 * - Rusted Key (36)
 * - Match Stick (41)
 * - Lucky Toe (42)
 * - Safety Cap (44)
 * - Ace of Spades (45)
 * - Lucky Foot (46)
 * - Watch Battery (72)
 * - Silver Dollar (110)
 * - Bloody Crown (111)
 * - Nuh Uh! (165)
 *
 * Old Capacitor (143) does not need to be removed, since the Lil Battery chance is independent of
 * the room drop.
 */
function spawnSeededDrop() {
  const centerPos = g.r.GetCenterPos();
  const rng = getRNGToUse();

  let pickupVariant = getPickupVariant(rng);

  // Contract From Below has a chance to either:
  // 1) increase the amount of pickups that drop
  // 2) or make nothing drop
  let pickupCount = 1;
  if (
    anyPlayerHasCollectible(CollectibleType.CONTRACT_FROM_BELOW) &&
    pickupVariant !== PickupVariant.TRINKET
  ) {
    pickupCount =
      getTotalPlayerCollectibles(CollectibleType.CONTRACT_FROM_BELOW) + 1;

    // Nothing chance with:
    // - 1 contract / 2 pickups: 0.44
    // - 2 contracts / 3 pickups: 0.44 (base) (would be 0.3 otherwise)
    // - 3 contracts / 4 pickups: 0.2
    // - 4 contracts / 5 pickups: 0.13
    const nothingChance = 0.666 ** pickupCount;
    if (nothingChance * 0.5 > rng.RandomFloat()) {
      pickupCount = 0;
    }
  }

  // Hard mode has a chance to remove a heart drop.
  if (
    game.Difficulty === Difficulty.HARD &&
    pickupVariant === PickupVariant.HEART
  ) {
    if (rng.RandomInt(100) >= 35) {
      pickupVariant = PickupVariant.NULL;
    }
  }

  // Broken Modem has a chance to increase the amount of pickups that drop.
  if (pickupCount >= 1) {
    const numBrokenModems = getTotalPlayerCollectibles(
      CollectibleType.BROKEN_MODEM,
    );
    repeat(numBrokenModems, () => {
      if (
        rng.RandomInt(4) === 0 &&
        (pickupVariant === PickupVariant.HEART || // 10
          pickupVariant === PickupVariant.COIN || // 20
          pickupVariant === PickupVariant.KEY || // 30
          pickupVariant === PickupVariant.BOMB || // 40
          pickupVariant === PickupVariant.SACK) // 69
      ) {
        pickupCount++;
      }
    });
  }

  if (pickupCount > 0 && pickupVariant !== PickupVariant.NULL) {
    let subType = 0;
    repeat(pickupCount, () => {
      const position = findFreePosition(centerPos);
      const seed = rng.Next();
      const pickup = spawnPickupWithSeed(
        pickupVariant,
        subType,
        position,
        seed,
      );

      // Pickups with a sub-type of 0 can morph into the various kinds of other pickups. If we are
      // spawning a 2nd copy of this pickup, make sure that it is the same type.
      subType = pickup.SubType;
    });
  }
}

function getPickupVariant(rng: RNG) {
  // Get a random value between 0 and 1 that will determine what kind of reward we get.
  const pickupPercent = rng.RandomFloat();

  // 22% chance for nothing to drop.
  let pickupVariant = PickupVariant.NULL;
  if (pickupPercent > 0.22) {
    if (pickupPercent < 0.3) {
      // 7% chance for a card / trinket / pill.
      if (rng.RandomInt(3) === 0) {
        // 7% * 33% = 2.3% chance.
        pickupVariant = PickupVariant.TAROT_CARD; // 300
      } else if (rng.RandomInt(2) === 0) {
        // 7% * 66% * 50% = 2.3% chance.
        pickupVariant = PickupVariant.TRINKET; // 350
      } else {
        // 7% * 66% * 50% = 2.3% chance.
        pickupVariant = PickupVariant.PILL; // 70
      }
    } else if (pickupPercent < 0.45) {
      // 15% for a coin.
      pickupVariant = PickupVariant.COIN; // 20
    } else if (pickupPercent < 0.6) {
      // 15% for a heart.
      pickupVariant = PickupVariant.HEART; // 10
    } else if (pickupPercent < 0.8) {
      // 20% for a key.
      pickupVariant = PickupVariant.KEY; // 30
    } else if (pickupPercent < 0.95) {
      // 15% for a bomb.
      pickupVariant = PickupVariant.BOMB; // 40
    } else {
      // 5% for a chest.
      pickupVariant = PickupVariant.CHEST; // 50
    }

    if (rng.RandomInt(20) === 0) {
      pickupVariant = PickupVariant.LIL_BATTERY; // 90
    }

    if (rng.RandomInt(50) === 0) {
      pickupVariant = PickupVariant.SACK; // 69
    }
  }

  return pickupVariant;
}

function getRNGToUse() {
  const roomType = g.r.GetType();

  if (
    roomType === RoomType.DEVIL || // 14
    roomType === RoomType.ANGEL // 15
  ) {
    return v.run.rng.devilAngel;
  }

  return v.run.rng.normalRooms;
}
