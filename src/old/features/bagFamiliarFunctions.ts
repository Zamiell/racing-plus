import { ZERO_VECTOR } from "../constants";
import g from "../globals";
import * as misc from "../misc";
import FamiliarVars from "../types/FamiliarVars";

const functionMap = new Map<
  int,
  (
    familiar: EntityFamiliar,
    vars: FamiliarVars,
    constant1: float,
    constant2: float,
  ) => void
>();
export default functionMap;

// 20
functionMap.set(
  FamiliarVariant.BOMB_BAG,
  (
    familiar: EntityFamiliar,
    vars: FamiliarVars,
    constant1: float,
    _constant2: float,
  ) => {
    // This drops a bomb based on the formula:
    // floor(cleared / 1.1) > 0 && floor(cleared / 1.1) & 1 == 0
    // or, with BFFs!:
    // floor(cleared / 1.2) > 0 && floor(cleared / 1.2) & 1 == 0
    const newRoomsCleared = vars.roomsCleared + 1;
    if (
      math.floor(newRoomsCleared / constant1) > 0 &&
      (math.floor(newRoomsCleared / constant1) & 1) === 0
    ) {
      // Random Bomb
      vars.seed = misc.incrementRNG(vars.seed);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_BOMB,
        familiar.Position,
        ZERO_VECTOR,
        familiar,
        0,
        vars.seed,
      );
    }
  },
);

// 21
functionMap.set(
  FamiliarVariant.SACK_OF_PENNIES,
  (
    familiar: EntityFamiliar,
    vars: FamiliarVars,
    _constant1: float,
    _constant2: float,
  ) => {
    // This drops a penny/nickel/dime/etc. based on the formula:
    // cleared > 0 && cleared & 1 == 0
    // or, with BFFs!:
    // cleared > 0 && (cleared & 1 == 0 || rand() % 3 == 0)
    const newRoomsCleared = vars.roomsCleared + 1;
    vars.seed = misc.incrementRNG(vars.seed);
    math.randomseed(vars.seed);
    const sackBFFChance = math.random(1, 4294967295);
    if (
      (newRoomsCleared > 0 && (newRoomsCleared & 1) === 0) ||
      (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS) &&
        sackBFFChance % 3 === 0)
    ) {
      // Random Coin
      vars.seed = misc.incrementRNG(vars.seed);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COIN,
        familiar.Position,
        ZERO_VECTOR,
        g.p,
        0,
        vars.seed,
      );
    }
  },
);

// 22
functionMap.set(
  FamiliarVariant.LITTLE_CHAD,
  (
    familiar: EntityFamiliar,
    vars: FamiliarVars,
    constant1: float,
    _constant2: float,
  ) => {
    // This drops a half a red heart based on the formula:
    // floor(cleared / 1.1) > 0 && floor(cleared / 1.1) & 1 == 0
    // or, with BFFs!:
    // floor(cleared / 1.2) > 0 && floor(cleared / 1.2) & 1 == 0
    const newRoomsCleared = vars.roomsCleared + 1;

    if (
      math.floor(newRoomsCleared / constant1) > 0 &&
      (math.floor(newRoomsCleared / constant1) & 1) === 0
    ) {
      vars.seed = misc.incrementRNG(vars.seed);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_HEART,
        familiar.Position,
        ZERO_VECTOR,
        familiar,
        HeartSubType.HEART_HALF,
        vars.seed,
      );
    }
  },
);

// 23
functionMap.set(
  FamiliarVariant.RELIC,
  (
    familiar: EntityFamiliar,
    vars: FamiliarVars,
    _constant1: float,
    constant2: float,
  ) => {
    // This drops a soul heart based on the formula:
    // floor(cleared / 1.11) & 3 == 2
    // or, with BFFs!:
    // floor(cleared / 1.15) & 3 == 2
    const newRoomsCleared = vars.roomsCleared + 1;

    if ((math.floor(newRoomsCleared / constant2) & 3) === 2) {
      // Heart (soul)
      vars.seed = misc.incrementRNG(vars.seed);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_HEART,
        familiar.Position,
        ZERO_VECTOR,
        familiar,
        HeartSubType.HEART_SOUL,
        vars.seed,
      );
    }
  },
);

// 52
functionMap.set(
  FamiliarVariant.JUICY_SACK,
  (
    familiar: EntityFamiliar,
    vars: FamiliarVars,
    _constant1: float,
    _constant2: float,
  ) => {
    // Spawn either 1 or 2 blue spiders (50% chance of each)
    vars.seed = misc.incrementRNG(vars.seed);
    math.randomseed(vars.seed);
    const spiders = math.random(1, 2);
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
  (
    familiar: EntityFamiliar,
    vars: FamiliarVars,
    _constant1: float,
    constant2: float,
  ) => {
    // This drops a heart, coin, bomb, or key based on the formula:
    // floor(cleared / 1.11) & 3 == 2
    // or:
    // floor(cleared / 1.15) & 3 == 2
    // (also, each pickup sub-type has an equal chance of occurring)
    const newRoomsCleared = vars.roomsCleared + 1;

    if ((math.floor(newRoomsCleared / constant2) & 3) !== 2) {
      return;
    }

    // First, decide whether we get a heart, coin, bomb, or key
    vars.seed = misc.incrementRNG(vars.seed);
    math.randomseed(vars.seed);
    const mysterySackPickupType = math.random(1, 4);
    vars.seed = misc.incrementRNG(vars.seed);
    math.randomseed(vars.seed);

    switch (mysterySackPickupType) {
      case 1: {
        const heartType = math.random(1, 11); // From Heart (5.10.1) to Bone Heart (5.10.11)
        g.g.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_HEART,
          familiar.Position,
          ZERO_VECTOR,
          familiar,
          heartType,
          vars.seed,
        );
        break;
      }

      case 2: {
        const coinType = math.random(1, 6); // From Penny (5.20.1) to Sticky Nickel (5.20.6)
        g.g.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_COIN,
          familiar.Position,
          ZERO_VECTOR,
          familiar,
          coinType,
          vars.seed,
        );
        break;
      }

      case 3: {
        const keyType = math.random(1, 4); // From Key (5.30.1) to Charged Key (5.30.4)
        g.g.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_KEY,
          familiar.Position,
          ZERO_VECTOR,
          familiar,
          keyType,
          vars.seed,
        );
        break;
      }

      case 4: {
        const bombType = math.random(1, 4); // From Bomb (5.40.1) to Golden Bomb (5.40.4)
        g.g.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_BOMB,
          familiar.Position,
          ZERO_VECTOR,
          familiar,
          bombType,
          vars.seed,
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
    vars: FamiliarVars,
    _constant1: float,
    _constant2: float,
  ) => {
    // This drops a heart, coin, bomb, or key based on the formula:
    // 10% chance for a trinket, if no trinket, 25% chance for a random consumable (based on time)
    // Or, with BFFS!:
    // 12.5% chance for a trinket, if no trinket, 31.25% chance for a random consumable (based on time)
    // We don't want it based on time in the Racing+ mod

    // First, decide whether we get a trinket
    vars.seed = misc.incrementRNG(vars.seed);
    math.randomseed(vars.seed);
    const lilChestTrinket = math.random(1, 1000);
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
        ZERO_VECTOR,
        familiar,
        0,
        vars.seed,
      );
      return;
    }

    // Second, decide whether it spawns a consumable
    vars.seed = misc.incrementRNG(vars.seed);
    math.randomseed(vars.seed);
    const lilChestConsumable = math.random(1, 10000);
    if (
      lilChestConsumable <= 2500 ||
      (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS) &&
        lilChestConsumable <= 3125)
    ) {
      // Third, decide whether we get a heart, coin, bomb, or key
      vars.seed = misc.incrementRNG(vars.seed);
      math.randomseed(vars.seed);
      const lilChestPickupType = math.random(1, 4);
      vars.seed = misc.incrementRNG(vars.seed);

      switch (lilChestPickupType) {
        case 1: {
          // Random Heart
          g.g.Spawn(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_HEART,
            familiar.Position,
            ZERO_VECTOR,
            familiar,
            0,
            vars.seed,
          );
          break;
        }

        case 2: {
          // Random Coin
          g.g.Spawn(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_COIN,
            familiar.Position,
            ZERO_VECTOR,
            familiar,
            0,
            vars.seed,
          );
          break;
        }

        case 3: {
          // Random Key
          g.g.Spawn(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_KEY,
            familiar.Position,
            ZERO_VECTOR,
            familiar,
            0,
            vars.seed,
          );
          break;
        }

        case 4: {
          // Random Bomb
          g.g.Spawn(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_BOMB,
            familiar.Position,
            ZERO_VECTOR,
            familiar,
            0,
            vars.seed,
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
    vars: FamiliarVars,
    _constant1: float,
    _constant2: float,
  ) => {
    // Level 2 Bumbo has a 32% chance (or 40% with BFFs!) to drop a random pickup
    // It will be state 0 at level 1, state 1 at level 2, state 2 at level 3, and state 3 at level 4
    if (familiar.State + 1 !== 2) {
      return;
    }

    vars.seed = misc.incrementRNG(vars.seed);
    math.randomseed(vars.seed);
    const bumboPickup = math.random(1, 100);
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
        ZERO_VECTOR,
        familiar,
        0,
        vars.seed,
      );
    }
  },
);

// 91
functionMap.set(
  FamiliarVariant.RUNE_BAG,
  (
    familiar: EntityFamiliar,
    vars: FamiliarVars,
    _constant1: float,
    constant2: float,
  ) => {
    // This drops a random rune based on the formula:
    // floor(roomsCleared / 1.11) & 3 == 2
    // Or, with BFFs!:
    // floor(roomsCleared / 1.15) & 3 == 2
    const newRoomsCleared = vars.roomsCleared + 1;

    if ((math.floor(newRoomsCleared / constant2) & 3) === 2) {
      // For some reason you cannot spawn the "Random Rune" entity (5.301.0)
      // So, use the GetCard() function as a workaround
      vars.seed = misc.incrementRNG(vars.seed);
      const subType = g.itemPool.GetCard(vars.seed, false, true, true);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_TAROTCARD,
        familiar.Position,
        ZERO_VECTOR,
        familiar,
        subType,
        vars.seed,
      );
    }
  },
);

// 94
functionMap.set(
  FamiliarVariant.SPIDER_MOD,
  (
    familiar: EntityFamiliar,
    vars: FamiliarVars,
    _constant1: float,
    _constant2: float,
  ) => {
    // Spider Mod has a 10% chance (or 12.5% with BFFs!) to do something
    vars.seed = misc.incrementRNG(vars.seed);
    math.randomseed(vars.seed);
    const spiderModChance = math.random(1, 1000);
    if (
      spiderModChance <= 100 ||
      (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS) &&
        spiderModChance <= 125)
    ) {
      // There is a 1/3 chance to spawn a battery and a 2/3 chance to spawn a blue spider
      vars.seed = misc.incrementRNG(vars.seed);
      math.randomseed(vars.seed);
      const spiderModDrop = math.random(1, 3);
      if (spiderModDrop === 1) {
        g.g.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_LIL_BATTERY,
          familiar.Position,
          ZERO_VECTOR,
          familiar,
          0,
          vars.seed,
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
  (
    familiar: EntityFamiliar,
    vars: FamiliarVars,
    constant1: float,
    _constant2: float,
  ) => {
    // This drops a pill based on the formula:
    // floor(roomsCleared / 1.1) > 0 && floor(roomsCleared / 1.1) & 1 == 0
    // Or, with BFFs!:
    // floor(roomsCleared / 1.2) > 0 && floor(roomsCleared / 1.2) & 1 == 0
    const newRoomsCleared = vars.roomsCleared + 1;
    if (
      math.floor(newRoomsCleared / constant1) > 0 &&
      (math.floor(newRoomsCleared / constant1) & 1) === 0
    ) {
      // Random Pill
      vars.seed = misc.incrementRNG(vars.seed);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_PILL,
        familiar.Position,
        ZERO_VECTOR,
        familiar,
        0,
        vars.seed,
      );
    }
  },
);

// 114
functionMap.set(
  FamiliarVariant.SPIDER_MOD,
  (
    familiar: EntityFamiliar,
    vars: FamiliarVars,
    constant1: float,
    _constant2: float,
  ) => {
    // This drops a sack based on the formula:
    // floor(roomsCleared / 1.1) > 0 && floor(roomsCleared / 1.1) & 1 == 0
    // Or, with BFFs!:
    // floor(roomsCleared / 1.2) > 0 && floor(roomsCleared / 1.2) & 1 == 0
    const newRoomsCleared = vars.roomsCleared + 1;

    if (
      math.floor(newRoomsCleared / constant1) > 0 &&
      (math.floor(newRoomsCleared / constant1) & 1) === 0
    ) {
      vars.seed = misc.incrementRNG(vars.seed);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_GRAB_BAG,
        familiar.Position,
        ZERO_VECTOR,
        familiar,
        0,
        vars.seed,
      );
    }
  },
);
