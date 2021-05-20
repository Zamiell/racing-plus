import g from "../../globals";
import { getRandom, incrementRNG } from "../../misc";
import {
  getCurrentFamiliarSeed,
  shouldDropHeart,
  shouldDropSomething,
} from "./bagFamiliarSubroutines";

const functionMap = new Map<int, (familiar: EntityFamiliar) => void>();
export default functionMap;

// 20
functionMap.set(FamiliarVariant.BOMB_BAG, (familiar: EntityFamiliar) => {
  if (shouldDropSomething(familiar)) {
    // Random Bomb
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_BOMB,
      familiar.Position,
      Vector.Zero,
      familiar,
      0,
      getCurrentFamiliarSeed(familiar),
    );
  }
});

// 21
functionMap.set(FamiliarVariant.SACK_OF_PENNIES, (familiar: EntityFamiliar) => {
  if (shouldDropSomething(familiar)) {
    // Random Coin
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_COIN,
      familiar.Position,
      Vector.Zero,
      g.p,
      0,
      getCurrentFamiliarSeed(familiar),
    );
  }
});

// 22
functionMap.set(FamiliarVariant.LITTLE_CHAD, (familiar: EntityFamiliar) => {
  if (shouldDropHeart(familiar)) {
    // Half heart
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_HEART,
      familiar.Position,
      Vector.Zero,
      familiar,
      HeartSubType.HEART_HALF,
      getCurrentFamiliarSeed(familiar),
    );
  }
});

// 23
functionMap.set(FamiliarVariant.RELIC, (familiar: EntityFamiliar) => {
  if (shouldDropHeart(familiar)) {
    // Heart (soul)
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_HEART,
      familiar.Position,
      Vector.Zero,
      familiar,
      HeartSubType.HEART_SOUL,
      getCurrentFamiliarSeed(familiar),
    );
  }
});

// 52
functionMap.set(FamiliarVariant.JUICY_SACK, (familiar: EntityFamiliar) => {
  // Spawn either 1 or 2 blue spiders (50% chance of each)
  const familiarSeed = getCurrentFamiliarSeed(familiar);
  const spiders = getRandom(1, 2, familiarSeed);
  g.p.AddBlueSpider(familiar.Position);
  if (spiders === 2) {
    g.p.AddBlueSpider(familiar.Position);
  }

  // The BFFS! synergy gives an additional spider
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS)) {
    g.p.AddBlueSpider(familiar.Position);
  }
});

// 57
functionMap.set(FamiliarVariant.MYSTERY_SACK, (familiar: EntityFamiliar) => {
  if (!shouldDropSomething(familiar)) {
    return;
  }

  // First, decide whether we get a heart, coin, bomb, or key
  const familiarSeed = getCurrentFamiliarSeed(familiar);
  const mysterySackPickupType = getRandom(1, 4, familiarSeed);

  switch (mysterySackPickupType) {
    case 1: {
      // From Heart (5.10.1) to Bone Heart (5.10.11)
      const heartType = getRandom(1, 11, familiarSeed);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_HEART,
        familiar.Position,
        Vector.Zero,
        familiar,
        heartType,
        familiarSeed,
      );
      break;
    }

    case 2: {
      // From Penny (5.20.1) to Sticky Nickel (5.20.6)
      const coinType = getRandom(1, 6, familiarSeed);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COIN,
        familiar.Position,
        Vector.Zero,
        familiar,
        coinType,
        familiarSeed,
      );
      break;
    }

    case 3: {
      // From Key (5.30.1) to Charged Key (5.30.4)
      const keyType = getRandom(1, 4, familiarSeed);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_KEY,
        familiar.Position,
        Vector.Zero,
        familiar,
        keyType,
        familiarSeed,
      );
      break;
    }

    case 4: {
      // From Bomb (5.40.1) to Golden Bomb (5.40.4)
      const bombType = getRandom(1, 4, familiarSeed);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_BOMB,
        familiar.Position,
        Vector.Zero,
        familiar,
        bombType,
        familiarSeed,
      );
      break;
    }

    default: {
      error("Invalid Mystery Sack pickup type.");
    }
  }
});

// 82
functionMap.set(FamiliarVariant.LIL_CHEST, (familiar: EntityFamiliar) => {
  // This drops a heart, coin, bomb, or key based on the formula:
  // 10% chance for a trinket, if no trinket, 25% chance for a random consumable (based on time)
  // Or, with BFFS!:
  // 12.5% chance for a trinket, if no trinket, 31.25% chance for a random consumable (based on
  // time)
  // We don't want it based on time in the Racing+ mod, so we ignore that part

  // First, decide whether we get a trinket
  let familiarSeed = getCurrentFamiliarSeed(familiar);
  const lilChestTrinket = getRandom(1, 1000, familiarSeed);
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
      familiarSeed,
    );
    return;
  }

  // Second, decide whether it spawns a consumable
  familiarSeed = incrementRNG(familiarSeed);
  const lilChestConsumable = getRandom(1, 10000, familiarSeed);
  if (
    lilChestConsumable <= 2500 ||
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS) &&
      lilChestConsumable <= 3125)
  ) {
    // Third, decide whether we get a heart, coin, bomb, or key
    familiarSeed = incrementRNG(familiarSeed);
    const lilChestPickupType = getRandom(1, 4, familiarSeed);

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
          familiarSeed,
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
          familiarSeed,
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
          familiarSeed,
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
          familiarSeed,
        );
        break;
      }

      default: {
        error("Invalid Lil' Chest pickup type.");
      }
    }
  }
});

// 88
functionMap.set(FamiliarVariant.BUMBO, (familiar: EntityFamiliar) => {
  // Level 2 Bumbo has a 32% chance (or 40% with BFFs!) to drop a random pickup
  // It will be state 0 at level 1, state 1 at level 2, state 2 at level 3, and state 3 at level 4
  const bumboLevel = familiar.State + 1;
  if (bumboLevel !== 2) {
    return;
  }

  const familiarSeed = getCurrentFamiliarSeed(familiar);
  const bumboPickup = getRandom(1, 100, familiarSeed);
  if (
    bumboPickup <= 32 ||
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS) && bumboPickup <= 40)
  ) {
    // Spawn a random pickup
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      0,
      familiar.Position,
      Vector.Zero,
      familiar,
      0,
      familiarSeed,
    );
  }
});

// 91
functionMap.set(FamiliarVariant.RUNE_BAG, (familiar: EntityFamiliar) => {
  if (shouldDropSomething(familiar)) {
    // For some reason you cannot spawn the "Random Rune" entity (5.301.0)
    // So, use the GetCard() function as a workaround
    const familiarSeed = getCurrentFamiliarSeed(familiar);
    const subType = g.itemPool.GetCard(familiarSeed, false, true, true);
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TAROTCARD,
      familiar.Position,
      Vector.Zero,
      familiar,
      subType,
      familiarSeed,
    );
  }
});

// 94
functionMap.set(FamiliarVariant.SPIDER_MOD, (familiar: EntityFamiliar) => {
  // Spider Mod has a 10% chance (or 12.5% with BFFs!) to do something
  let familiarSeed = getCurrentFamiliarSeed(familiar);
  const spiderModChance = getRandom(1, 1000, familiarSeed);
  if (
    spiderModChance <= 100 ||
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS) &&
      spiderModChance <= 125)
  ) {
    // There is a 1/3 chance to spawn a battery and a 2/3 chance to spawn a blue spider
    familiarSeed = incrementRNG(familiarSeed);
    const spiderModDrop = getRandom(1, 3, familiarSeed);
    if (spiderModDrop === 1) {
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_LIL_BATTERY,
        familiar.Position,
        Vector.Zero,
        familiar,
        0,
        familiarSeed,
      );
    } else {
      g.p.AddBlueSpider(familiar.Position);
    }
  }
});

// 112
functionMap.set(FamiliarVariant.ACID_BABY, (familiar: EntityFamiliar) => {
  if (shouldDropSomething(familiar)) {
    // Random Pill
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_PILL,
      familiar.Position,
      Vector.Zero,
      familiar,
      0,
      getCurrentFamiliarSeed(familiar),
    );
  }
});

// 114
functionMap.set(FamiliarVariant.SACK_OF_SACKS, (familiar: EntityFamiliar) => {
  if (shouldDropSomething(familiar)) {
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_GRAB_BAG,
      familiar.Position,
      Vector.Zero,
      familiar,
      0,
      getCurrentFamiliarSeed(familiar),
    );
  }
});
