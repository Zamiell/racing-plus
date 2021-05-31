/*
// 26 total item effects
// https://bindingofisaacrebirth.gamepedia.com/Dead_Sea_Scrolls
// Listed in alphabetical order
const DEAD_SEA_SCROLLS_EFFECTS = [
  CollectibleType.COLLECTIBLE_ANARCHIST_COOKBOOK, // 65 (#1)
  CollectibleType.COLLECTIBLE_BOBS_ROTTEN_HEAD, // 42 (#2)
  CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL, // 34 (#3)
  CollectibleType.COLLECTIBLE_BOOK_REVELATIONS, // 78 (#4)
  CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS, // 58 (#5)
  CollectibleType.COLLECTIBLE_BOOK_OF_SIN, // 97 (#6)
  CollectibleType.COLLECTIBLE_CRACK_THE_SKY, // 160 (#7)
  CollectibleType.COLLECTIBLE_DECK_OF_CARDS, // 85 (#8)
  CollectibleType.COLLECTIBLE_GAMEKID, // 93 (#9)
  CollectibleType.COLLECTIBLE_HOURGLASS, // 66 (#10)
  CollectibleType.COLLECTIBLE_KAMIKAZE, // 40 (#11)
  CollectibleType.COLLECTIBLE_LEMON_MISHAP, // 56 (#12)
  CollectibleType.COLLECTIBLE_MOMS_BOTTLE_PILLS, // 102 (#13)
  CollectibleType.COLLECTIBLE_MOMS_BRA, // 39 (#14)
  CollectibleType.COLLECTIBLE_MONSTROS_TOOTH, // 86 (#15)
  CollectibleType.COLLECTIBLE_MR_BOOM, // 37 (#16)
  CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN, // 77 (#17)
  CollectibleType.COLLECTIBLE_THE_NAIL, // 83 (#18)
  CollectibleType.COLLECTIBLE_PINKING_SHEARS, // 107 (#19)
  CollectibleType.COLLECTIBLE_SATANIC_BIBLE, // 292 (#20)
  CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP, // 49 (#21)
  CollectibleType.COLLECTIBLE_TAMMYS_HEAD, // 38 (#22)
  CollectibleType.COLLECTIBLE_TELEPORT, // 44 (#23)
  CollectibleType.COLLECTIBLE_WE_NEED_GO_DEEPER, // 84 (#24)
  CollectibleType.COLLECTIBLE_YUM_HEART, // 45 (#25)
  CollectibleType.COLLECTIBLE_WOODEN_NICKEL, // 349 (#26)
];

// CollectibleType.COLLECTIBLE_WE_NEED_GO_DEEPER (84)
// This callback is used naturally by Ehwaz (Passage) runes
export function weNeedToGoDeeper(): boolean | null {
  // Local variables
  const stage = g.l.GetStage();

  // Prevent the racers from "cheating" by using the shovel on Womb 2 in the "Everything" race goal
  if (g.race.goal === "Everything" && stage === 8) {
    // Signal that what they did was illegal
    g.p.AnimateSad();

    // By returning true, it will cancel the original effect
    return true;
  }

  return null;
}

// CollectibleType.COLLECTIBLE_BOOK_OF_SIN (97)
export function bookOfSin(): boolean {
  // The Book of Sin has an equal chance to spawn a heart, coin, bomb, key, battery, pill,
  // or card/rune
  g.RNGCounter.bookOfSin = misc.incrementRNG(g.RNGCounter.bookOfSin);
  math.randomseed(g.RNGCounter.bookOfSin);
  const bookPickupType = math.random(1, 7);
  g.RNGCounter.bookOfSin = misc.incrementRNG(g.RNGCounter.bookOfSin);

  const position = g.r.FindFreePickupSpawnPosition(g.p.Position, 0, true);
  const velocity = Vector.Zero;

  switch (bookPickupType) {
    case 1: {
      // Random Heart
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_HEART, // 10
        position,
        velocity,
        g.p,
        0,
        g.RNGCounter.bookOfSin,
      );

      break;
    }

    case 2: {
      // Random Coin
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COIN, // 20
        position,
        velocity,
        g.p,
        0,
        g.RNGCounter.bookOfSin,
      );

      break;
    }

    case 3: {
      // Random Bomb
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_BOMB, // 40
        position,
        velocity,
        g.p,
        0,
        g.RNGCounter.bookOfSin,
      );

      break;
    }

    case 4: {
      // Random Key
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_KEY, // 30
        position,
        velocity,
        g.p,
        0,
        g.RNGCounter.bookOfSin,
      );

      break;
    }

    case 5: {
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_LIL_BATTERY, // 90
        position,
        velocity,
        g.p,
        0,
        g.RNGCounter.bookOfSin,
      );

      break;
    }

    case 6: {
      // Random Pill
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_PILL, // 70
        position,
        velocity,
        g.p,
        0,
        g.RNGCounter.bookOfSin,
      );

      break;
    }

    case 7: {
      // Random Card/Rune
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_TAROTCARD, // 300
        position,
        velocity,
        g.p,
        0,
        g.RNGCounter.bookOfSin,
      );

      break;
    }

    default: {
      error("Invalid pickup type for the Book of Sin.");
    }
  }

  // When we return from the function below, no animation will play,
  // so we have to explicitly perform one
  g.p.AnimateCollectible(
    CollectibleType.COLLECTIBLE_BOOK_OF_SIN,
    "UseItem",
    "PlayerPickup",
  ); // 97

  // Since we cancel the original effect, the UseItem callback will never fire, so do it manually
  useItem.main(CollectibleType.COLLECTIBLE_BOOK_OF_SIN);

  // By returning true, it will cancel the original effect
  return true;
}

// CollectibleType.COLLECTIBLE_DEAD_SEA_SCROLLS (124)
export function deadSeaScrolls(): boolean {
  // Get a random effect from the list
  g.RNGCounter.deadSeaScrolls = misc.incrementRNG(g.RNGCounter.deadSeaScrolls);
  math.randomseed(g.RNGCounter.deadSeaScrolls);
  const effectTypeIndex = math.random(0, DEAD_SEA_SCROLLS_EFFECTS.length - 1);
  const effectType = DEAD_SEA_SCROLLS_EFFECTS[effectTypeIndex];

  // Do it
  g.p.UseActiveItem(effectType, false, false, false, false);

  // Display the streak text so that they know what item they got
  g.run.streakText = g.itemConfig.GetCollectible(effectType).Name;
  g.run.streakFrame = Isaac.GetFrameCount();

  // When we return from the function below, no animation will play,
  // so we have to explicitly perform one
  g.p.AnimateCollectible(
    CollectibleType.COLLECTIBLE_DEAD_SEA_SCROLLS,
    "UseItem",
    "PlayerPickup",
  );

  // Get rid of the charges
  // (otherwise, the charges won't be consistently depleted)
  const activeCharge = g.p.GetActiveCharge();
  const batteryCharge = g.p.GetBatteryCharge();
  let totalCharge = activeCharge + batteryCharge;
  totalCharge -= 2;
  g.p.SetActiveCharge(totalCharge);

  // Since we cancel the original effect, the UseItem callback will never fire, so do it manually
  useItem.main(CollectibleType.COLLECTIBLE_DEAD_SEA_SCROLLS);

  // Cancel the original effect
  return true;
}

// CollectibleType.COLLECTIBLE_GUPPYS_HEAD (145)
export function guppysHead(): boolean {
  g.RNGCounter.guppysHead = misc.incrementRNG(g.RNGCounter.guppysHead);
  math.randomseed(g.RNGCounter.guppysHead);
  const numFlies = math.random(2, 4);
  g.p.AddBlueFlies(numFlies, g.p.Position, null);

  // When we return from the function below, no animation will play,
  // so we have to explicitly perform one
  g.p.AnimateCollectible(
    CollectibleType.COLLECTIBLE_GUPPYS_HEAD,
    "UseItem",
    "PlayerPickup",
  );

  // Get rid of the charges
  // (otherwise, the charges won't be consistently depleted)
  const activeCharge = g.p.GetActiveCharge();
  const batteryCharge = g.p.GetBatteryCharge();
  let totalCharge = activeCharge + batteryCharge;
  totalCharge -= 1;
  g.p.SetActiveCharge(totalCharge);

  // Since we cancel the original effect, the UseItem callback will never fire, so do it manually
  useItem.main(CollectibleType.COLLECTIBLE_GUPPYS_HEAD);

  // Cancel the original effect
  return true;
}

// CollectibleType.COLLECTIBLE_GLOWING_HOUR_GLASS (422)
export function glowingHourGlass(): void {
  // Mark to reset the active item + the Schoolbag item
  if (
    g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM) &&
    // Broken Remote cancels the Glowing Hour Glass effect
    !g.p.HasTrinket(TrinketType.TRINKET_BROKEN_REMOTE)
  ) {
    g.run.schoolbag.usedGlowingHourGlass = 1;
  }
}

// CollectibleType.COLLECTIBLE_SMELTER (479)
// This callback is used naturally by Gulp! pills
export function smelter(): void {
  const trinket1 = g.p.GetTrinket(0); // This will be 0 if there is no trinket
  const trinket2 = g.p.GetTrinket(1); // This will be 0 if there is no trinket

  if (trinket1 !== 0) {
    // Send a message to the item tracker to add this trinket
    Isaac.DebugString(`Gulping trinket ${trinket1}`);
  }

  if (trinket2 !== 0) {
    // Send a message to the item tracker to add this trinket
    Isaac.DebugString(`Gulping trinket ${trinket2}`);
  }

  // Mark that the trinkets did ! break
  g.run.haveWishbone = false;
  g.run.haveWalnut = false;

  // By returning nothing, it will go on to do the Smelter effect
}

export function preventItemPedestalEffects(
  itemID: CollectibleType,
): boolean | null {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // Car Battery will mess up the D6 and D100 (and possibly others) because
  // this function will be entered twice on the same frame
  // (and there will be no time to replace the pedestal)
  // The same thing is true for Blank Card + Perthro rune + Tarot Cloth
  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_CAR_BATTERY) || // 356
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BLANK_CARD) && // 451
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_TAROT_CLOTH)) // 286
  ) {
    return null;
  }

  // Similarly, using a ? Card while having Tarot Cloth will cause the same problem
  if (gameFrameCount === g.run.questionMarkCard) {
    return null;
  }

  if (unreplacedItemsExist()) {
    Isaac.DebugString(
      `Canceling item ${itemID} due to unreplaced items in the room.`,
    );
    g.run.rechargeItemFrame = gameFrameCount + 1;
    return true;
  }

  const checkpoints = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
    false,
    false,
  );
  if (checkpoints.length > 0) {
    Isaac.DebugString(
      `Canceling item ${itemID} due to a Checkpoint in the room.`,
    );
    g.run.rechargeItemFrame = gameFrameCount + 1;
    return true;
  }

  return null;
}

function unreplacedItemsExist() {
  // Local variables
  const roomIndex = misc.getRoomIndex();

  // Look for pedestals that have not been replaced yet
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    -1,
    false,
    false,
  );
  for (const collectible of collectibles) {
    let alreadyReplaced = false;
    for (const pedestal of g.run.level.replacedPedestals) {
      if (
        pedestal.roomIndex === roomIndex &&
        pedestal.seed === collectible.InitSeed
      ) {
        alreadyReplaced = true;
        break;
      }
    }

    if (!alreadyReplaced && collectible.SubType !== 0) {
      return true;
    }
  }

  return false;
}
*/
