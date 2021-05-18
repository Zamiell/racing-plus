/*
// Normally, room drops are based on the room's seed
// This is undesirable, since someone can go a wrong way in a seeded race and then get rewarded with
// an Emperor card that the other player does not get
// Thus, we overwrite the game's room drop system with one that manually spawns awards in order
// The following code is based on the game's internal logic, documented here:
// https://bindingofisaacrebirth.gamepedia.com/Room_Clear_Awards
// (it was reverse engineered by blcd)
// However, there is some major difference from vanilla
// We hard-code values of 0 luck so that room drops are completely consistent
// (otherwise, one player would be able to get a lucky Emperor card by using a Luck Up or Luck Down
// pill, for example)
// Furthermore, we ignore the following items, since we remove them from pools:
// Lucky Foot, Silver Dollar, Bloody Crown, Daemon's Tail, Child's Heart, Rusted Key, Match Stick,
// Lucky Toe, Safety Cap, Ace of Spades, and Watch Battery
function spawnSeededClearAward() {
  // Local variables
  const roomType = g.r.GetType();
  const centerPos = g.r.GetCenterPos();

  // Find out which seed we should use
  // (Devil Rooms and Angel Rooms use a separate RNG counter so that players cannot get a lucky
  // battery)
  let seed: int;
  if (
    roomType === RoomType.ROOM_DEVIL || // 14
    roomType === RoomType.ROOM_ANGEL // 15
  ) {
    g.run.fastClear.roomClearAwardRNG2 = incrementRNG(
      g.run.fastClear.roomClearAwardRNG2,
    );
    seed = g.run.fastClear.roomClearAwardRNG2;
  } else {
    g.run.fastClear.roomClearAwardRNG = incrementRNG(
      g.run.fastClear.roomClearAwardRNG,
    );
    seed = g.run.fastClear.roomClearAwardRNG;
  }

  // Get a random value between 0 and 1 that will determine what kind of reward we get
  const rng = RNG();
  rng.SetSeed(seed, 35);
  const pickupPercent = rng.RandomFloat();

  // Determine the kind of pickup
  let pickupVariant = PickupVariant.PICKUP_NULL;
  if (pickupPercent > 0.22) {
    // 22% chance for nothing to drop
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

  // Contract From Below has a chance to either:
  // 1) increase the amount of pickups that drop
  // 2) or make nothing drop
  let pickupCount = 1;
  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_CONTRACT_FROM_BELOW) &&
    pickupVariant !== PickupVariant.PICKUP_TRINKET
  ) {
    pickupCount =
      g.p.GetCollectibleNum(CollectibleType.COLLECTIBLE_CONTRACT_FROM_BELOW) +
      1;

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
  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_BROKEN_MODEM) &&
    rng.RandomInt(4) === 0 &&
    pickupCount >= 1 &&
    (pickupVariant === PickupVariant.PICKUP_HEART || // 10
      pickupVariant === PickupVariant.PICKUP_COIN || // 20
      pickupVariant === PickupVariant.PICKUP_KEY || // 30
      pickupVariant === PickupVariant.PICKUP_BOMB || // 40
      pickupVariant === PickupVariant.PICKUP_GRAB_BAG) // 69
  ) {
    pickupCount += 1;
  }

  if (pickupCount > 0 && pickupVariant !== PickupVariant.PICKUP_NULL) {
    let subType = 0;
    for (let i = 1; i <= pickupCount; i++) {
      const pos = g.r.FindFreePickupSpawnPosition(centerPos, 1, true);
      const pickup = g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        pickupVariant,
        pos,
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
*/
