// Note that even though we previously incremented the familiar.RoomClearCount value before getting
// here, we still need to project familiar.RoomClearCount one value into the future in order for the
// logic to work properly

import g from "../../globals";
import { getRandom } from "../../misc";

const functionMap = new Map<
  int,
  (
    familiar: EntityFamiliar,
    rng: RNG,
    constant1: float,
    constant2: float,
  ) => void
>();
export default functionMap;

// 20
functionMap.set(
  FamiliarVariant.BOMB_BAG,
  (familiar: EntityFamiliar, rng: RNG, constant1: float, _constant2: float) => {
    // This drops a bomb based on the formula:
    // floor(cleared / 1.1) > 0 && floor(cleared / 1.1) & 1 == 0
    // or, with BFFs!:
    // floor(cleared / 1.2) > 0 && floor(cleared / 1.2) & 1 == 0
    const projectedClearCount = familiar.RoomClearCount + 1;
    if (
      math.floor(projectedClearCount / constant1) > 0 &&
      (math.floor(projectedClearCount / constant1) & 1) === 0
    ) {
      // Random Bomb
      rng.Next();
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_BOMB,
        familiar.Position,
        Vector.Zero,
        familiar,
        0,
        rng.GetSeed(),
      );
    }
  },
);

// 21
functionMap.set(
  FamiliarVariant.SACK_OF_PENNIES,
  (
    familiar: EntityFamiliar,
    rng: RNG,
    _constant1: float,
    _constant2: float,
  ) => {
    // This drops a penny/nickel/dime/etc. based on the formula:
    // cleared > 0 && cleared & 1 == 0
    // or, with BFFs!:
    // cleared > 0 && (cleared & 1 == 0 || rand() % 3 == 0)
    rng.Next();
    const sackBFFChance = rng.RandomInt(4294967295);
    const projectedClearCount = familiar.RoomClearCount + 1;
    if (
      (projectedClearCount > 0 && (projectedClearCount & 1) === 0) ||
      (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS) &&
        sackBFFChance % 3 === 0)
    ) {
      // Random Coin
      rng.Next();
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COIN,
        familiar.Position,
        Vector.Zero,
        g.p,
        0,
        rng.GetSeed(),
      );
    }
  },
);

// 22
functionMap.set(
  FamiliarVariant.LITTLE_CHAD,
  (familiar: EntityFamiliar, rng: RNG, constant1: float, _constant2: float) => {
    // This drops a half a red heart based on the formula:
    // floor(cleared / 1.1) > 0 && floor(cleared / 1.1) & 1 == 0
    // or, with BFFs!:
    // floor(cleared / 1.2) > 0 && floor(cleared / 1.2) & 1 == 0
    const projectedClearCount = familiar.RoomClearCount + 1;
    if (
      math.floor(projectedClearCount / constant1) > 0 &&
      (math.floor(projectedClearCount / constant1) & 1) === 0
    ) {
      rng.Next();
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_HEART,
        familiar.Position,
        Vector.Zero,
        familiar,
        HeartSubType.HEART_HALF,
        rng.GetSeed(),
      );
    }
  },
);

// 23
functionMap.set(
  FamiliarVariant.RELIC,
  (familiar: EntityFamiliar, rng: RNG, _constant1: float, constant2: float) => {
    // This drops a soul heart based on the formula:
    // floor(cleared / 1.11) & 3 == 2
    // or, with BFFs!:
    // floor(cleared / 1.15) & 3 == 2
    const projectedClearCount = familiar.RoomClearCount + 1;
    if ((math.floor(projectedClearCount / constant2) & 3) === 2) {
      // Heart (soul)
      rng.Next();
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_HEART,
        familiar.Position,
        Vector.Zero,
        familiar,
        HeartSubType.HEART_SOUL,
        rng.GetSeed(),
      );
    }
  },
);

// 52
functionMap.set(
  FamiliarVariant.JUICY_SACK,
  (
    familiar: EntityFamiliar,
    rng: RNG,
    _constant1: float,
    _constant2: float,
  ) => {
    // Spawn either 1 or 2 blue spiders (50% chance of each)
    rng.Next();
    const spiders = getRandom(1, 2, rng);
    g.p.AddBlueSpider(familiar.Position);
    if (spiders === 2) {
      g.p.AddBlueSpider(familiar.Position);
    }

    // The BFFS! synergy gives an additional spider
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS)) {
      g.p.AddBlueSpider(familiar.Position);
    }
  },
);

// 57
functionMap.set(
  FamiliarVariant.MYSTERY_SACK,
  (familiar: EntityFamiliar, rng: RNG, _constant1: float, constant2: float) => {
    // This drops a heart, coin, bomb, or key based on the formula:
    // floor(cleared / 1.11) & 3 == 2
    // or:
    // floor(cleared / 1.15) & 3 == 2
    // (also, each pickup sub-type has an equal chance of occurring)
    const projectedClearCount = familiar.RoomClearCount + 1;
    if ((math.floor(projectedClearCount / constant2) & 3) !== 2) {
      return;
    }

    // First, decide whether we get a heart, coin, bomb, or key
    rng.Next();
    const mysterySackPickupType = getRandom(1, 4, rng);
    rng.Next();

    switch (mysterySackPickupType) {
      case 1: {
        const heartType = getRandom(1, 11, rng); // From Heart (5.10.1) to Bone Heart (5.10.11)
        g.g.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_HEART,
          familiar.Position,
          Vector.Zero,
          familiar,
          heartType,
          rng.GetSeed(),
        );
        break;
      }

      case 2: {
        const coinType = getRandom(1, 6, rng); // From Penny (5.20.1) to Sticky Nickel (5.20.6)
        g.g.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_COIN,
          familiar.Position,
          Vector.Zero,
          familiar,
          coinType,
          rng.GetSeed(),
        );
        break;
      }

      case 3: {
        const keyType = getRandom(1, 4, rng); // From Key (5.30.1) to Charged Key (5.30.4)
        g.g.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_KEY,
          familiar.Position,
          Vector.Zero,
          familiar,
          keyType,
          rng.GetSeed(),
        );
        break;
      }

      case 4: {
        const bombType = getRandom(1, 4, rng); // From Bomb (5.40.1) to Golden Bomb (5.40.4)
        g.g.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_BOMB,
          familiar.Position,
          Vector.Zero,
          familiar,
          bombType,
          rng.GetSeed(),
        );
        break;
      }

      default: {
        error("Invalid Mystery Sack pickup type.");
      }
    }
  },
);

// 82
functionMap.set(
  FamiliarVariant.LIL_CHEST,
  (
    familiar: EntityFamiliar,
    rng: RNG,
    _constant1: float,
    _constant2: float,
  ) => {
    // This drops a heart, coin, bomb, or key based on the formula:
    // 10% chance for a trinket, if no trinket, 25% chance for a random consumable (based on time)
    // Or, with BFFS!:
    // 12.5% chance for a trinket, if no trinket, 31.25% chance for a random consumable (based on time)
    // We don't want it based on time in the Racing+ mod

    // First, decide whether we get a trinket
    rng.Next();
    const lilChestTrinket = getRandom(1, 1000, rng);
    if (
      lilChestTrinket <= 100 ||
      (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS) &&
        lilChestTrinket <= 125)
    ) {
      // Random Trinket
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_TRINKET,
        familiar.Position,
        Vector.Zero,
        familiar,
        0,
        rng.GetSeed(),
      );
      return;
    }

    // Second, decide whether it spawns a consumable
    rng.Next();
    const lilChestConsumable = getRandom(1, 10000, rng);
    if (
      lilChestConsumable <= 2500 ||
      (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS) &&
        lilChestConsumable <= 3125)
    ) {
      // Third, decide whether we get a heart, coin, bomb, or key
      rng.Next();
      const lilChestPickupType = getRandom(1, 4, rng);
      rng.Next();

      switch (lilChestPickupType) {
        case 1: {
          // Random Heart
          g.g.Spawn(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_HEART,
            familiar.Position,
            Vector.Zero,
            familiar,
            0,
            rng.GetSeed(),
          );
          break;
        }

        case 2: {
          // Random Coin
          g.g.Spawn(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_COIN,
            familiar.Position,
            Vector.Zero,
            familiar,
            0,
            rng.GetSeed(),
          );
          break;
        }

        case 3: {
          // Random Key
          g.g.Spawn(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_KEY,
            familiar.Position,
            Vector.Zero,
            familiar,
            0,
            rng.GetSeed(),
          );
          break;
        }

        case 4: {
          // Random Bomb
          g.g.Spawn(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_BOMB,
            familiar.Position,
            Vector.Zero,
            familiar,
            0,
            rng.GetSeed(),
          );
          break;
        }

        default: {
          error("Invalid Lil' Chest pickup type.");
        }
      }
    }
  },
);

// 88
functionMap.set(
  FamiliarVariant.BUMBO,
  (
    familiar: EntityFamiliar,
    rng: RNG,
    _constant1: float,
    _constant2: float,
  ) => {
    // Level 2 Bumbo has a 32% chance (or 40% with BFFs!) to drop a random pickup
    // It will be state 0 at level 1, state 1 at level 2, state 2 at level 3, and state 3 at level 4
    if (familiar.State + 1 !== 2) {
      return;
    }

    rng.Next();
    const bumboPickup = getRandom(1, 100, rng);
    if (
      bumboPickup <= 32 ||
      (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS) &&
        bumboPickup <= 40)
    ) {
      // Spawn a random pickup
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        0,
        familiar.Position,
        Vector.Zero,
        familiar,
        0,
        rng.GetSeed(),
      );
    }
  },
);

// 91
functionMap.set(
  FamiliarVariant.RUNE_BAG,
  (familiar: EntityFamiliar, rng: RNG, _constant1: float, constant2: float) => {
    // This drops a random rune based on the formula:
    // floor(roomsCleared / 1.11) & 3 == 2
    // Or, with BFFs!:
    // floor(roomsCleared / 1.15) & 3 == 2
    const projectedClearCount = familiar.RoomClearCount + 1;
    if ((math.floor(projectedClearCount / constant2) & 3) === 2) {
      // For some reason you cannot spawn the "Random Rune" entity (5.301.0)
      // So, use the GetCard() function as a workaround
      rng.Next();
      const subType = g.itemPool.GetCard(rng.GetSeed(), false, true, true);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_TAROTCARD,
        familiar.Position,
        Vector.Zero,
        familiar,
        subType,
        rng.GetSeed(),
      );
    }
  },
);

// 94
functionMap.set(
  FamiliarVariant.SPIDER_MOD,
  (
    familiar: EntityFamiliar,
    rng: RNG,
    _constant1: float,
    _constant2: float,
  ) => {
    // Spider Mod has a 10% chance (or 12.5% with BFFs!) to do something
    rng.Next();
    const spiderModChance = getRandom(1, 1000, rng);
    if (
      spiderModChance <= 100 ||
      (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS) &&
        spiderModChance <= 125)
    ) {
      // There is a 1/3 chance to spawn a battery and a 2/3 chance to spawn a blue spider
      rng.Next();
      const spiderModDrop = getRandom(1, 3, rng);
      if (spiderModDrop === 1) {
        g.g.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_LIL_BATTERY,
          familiar.Position,
          Vector.Zero,
          familiar,
          0,
          rng.GetSeed(),
        );
      } else {
        g.p.AddBlueSpider(familiar.Position);
      }
    }
  },
);

// 112
functionMap.set(
  FamiliarVariant.SPIDER_MOD,
  (familiar: EntityFamiliar, rng: RNG, constant1: float, _constant2: float) => {
    // This drops a pill based on the formula:
    // floor(roomsCleared / 1.1) > 0 && floor(roomsCleared / 1.1) & 1 == 0
    // Or, with BFFs!:
    // floor(roomsCleared / 1.2) > 0 && floor(roomsCleared / 1.2) & 1 == 0
    const projectedClearCount = familiar.RoomClearCount + 1;
    if (
      math.floor(projectedClearCount / constant1) > 0 &&
      (math.floor(projectedClearCount / constant1) & 1) === 0
    ) {
      // Random Pill
      rng.Next();
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_PILL,
        familiar.Position,
        Vector.Zero,
        familiar,
        0,
        rng.GetSeed(),
      );
    }
  },
);

// 114
functionMap.set(
  FamiliarVariant.SPIDER_MOD,
  (familiar: EntityFamiliar, rng: RNG, constant1: float, _constant2: float) => {
    // This drops a sack based on the formula:
    // floor(roomsCleared / 1.1) > 0 && floor(roomsCleared / 1.1) & 1 == 0
    // Or, with BFFs!:
    // floor(roomsCleared / 1.2) > 0 && floor(roomsCleared / 1.2) & 1 == 0
    const projectedClearCount = familiar.RoomClearCount + 1;
    if (
      math.floor(projectedClearCount / constant1) > 0 &&
      (math.floor(projectedClearCount / constant1) & 1) === 0
    ) {
      rng.Next();
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_GRAB_BAG,
        familiar.Position,
        Vector.Zero,
        familiar,
        0,
        rng.GetSeed(),
      );
    }
  },
);
