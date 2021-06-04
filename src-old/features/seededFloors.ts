/*
const ENABLED = true; // Set to false when debugging

// Different inventory and health conditions can affect special room generation
// Different special rooms can also sometimes change the actual room selection of non-special rooms
// This is bad for seeded races; we want to ensure consistent floors
// Thus, we arbitrarily set inventory and health conditions before going to the next floor,
// and then swap them back
// https://bindingofisaacrebirth.gamepedia.com/Level_Generation
export function before(stage: int): void {
  if (!ENABLED) {
    return;
  }

  // Local variables
  const character = g.p.GetPlayerType();
  const goldenHearts = g.p.GetGoldenHearts();
  const coins = g.p.GetNumCoins();
  const keys = g.p.GetNumKeys();
  let seed = g.seeds.GetStageSeed(stage);
  const challenge = Isaac.GetChallenge();

  // Only swap things if we are playing a specific seed
  if (!playingOnSetSeed()) {
    return;
  }

  // Record the current inventory && health values
  g.run.seededSwap.swapping = true;
  g.run.seededSwap.devilVisited = g.g.GetStateFlag(
    GameStateFlag.STATE_DEVILROOM_VISITED,
  );
  g.run.seededSwap.bookTouched = g.g.GetStateFlag(
    GameStateFlag.STATE_BOOK_PICKED_UP,
  );
  g.run.seededSwap.coins = coins;
  g.run.seededSwap.keys = keys;
  g.run.seededSwap.health = saveHealth();

  // Modification 1: Devil Room visited
  if (stage < 3) {
    g.g.SetStateFlag(GameStateFlag.STATE_DEVILROOM_VISITED, false);
  } else {
    g.g.SetStateFlag(GameStateFlag.STATE_DEVILROOM_VISITED, true);
  }

  // Modification 2: Book touched
  seed = misc.incrementRNG(seed);
  math.randomseed(seed);
  const bookMod = math.random(1, 2);
  if (bookMod === 1) {
    g.g.SetStateFlag(GameStateFlag.STATE_BOOK_PICKED_UP, false);
  } else if (bookMod === 2) {
    g.g.SetStateFlag(GameStateFlag.STATE_BOOK_PICKED_UP, true);
  }

  // Modification 3: Coins
  seed = misc.incrementRNG(seed);
  math.randomseed(seed);
  const coinMod = math.random(1, 2);
  g.p.AddCoins(-99);
  if (coinMod === 2) {
    // If coinMod is 1, we don't have to do anything (0 coins)
    // If coinMod is 2, we give 20 coins
    // (all we really need is 5 coins but give 20 in case we are on Keeper and have Greed's Gullet
    // and have empty coin containers)
    g.p.AddCoins(20);
  }

  // Modification 4: Keys
  seed = misc.incrementRNG(seed);
  math.randomseed(seed);
  const keyMod = math.random(1, 2);
  g.p.AddKeys(-99);
  if (keyMod === 2) {
    // If keyMod is 1, we don't have to do anything (0 keys)
    // If keyMod is 2, we give 2 keys
    g.p.AddKeys(2);
  }

  // Remove all health
  g.seeds.AddSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);
  // (we hide the health in case they are using Forget Me Now)
  g.p.AddGoldenHearts(goldenHearts * -1);
  // (we have to remove the exact amount of Golden Hearts or else it will bug out)
  // (we remove Golden Hearts first so that they don't break)
  g.p.AddMaxHearts(-24, false);
  g.p.AddSoulHearts(-24);
  g.p.AddBoneHearts(-12);

  // Modification 5: Full health
  seed = misc.incrementRNG(seed);
  math.randomseed(seed);
  g.p.AddMaxHearts(2, false);
  g.p.AddHearts(1);
  const fullHealthMod = math.random(1, 100);
  if (fullHealthMod <= 66) {
    // 66% chance to be full health
    g.p.AddHearts(1);
  }

  // Modification 6: Critical health
  seed = misc.incrementRNG(seed);
  math.randomseed(seed);
  const criticalHealthMod = math.random(1, 100);
  if (criticalHealthMod <= 75) {
    // 75% chance to not be at critical health
    g.p.AddSoulHearts(2);

    // Keeper will get 3 Blue Flies from this, so manually remove them
    if (character === PlayerType.PLAYER_KEEPER) {
      const blueFlies = Isaac.FindByType(
        EntityType.ENTITY_FAMILIAR,
        FamiliarVariant.BLUE_FLY,
      );
      for (let i = 0; i < blueFlies.length; i++) {
        if (i >= 3) {
          break;
        }
        const fly = blueFlies[i];
        fly.Remove();
      }
    }
  }
}

export function after(): void {
  if (!ENABLED) {
    return;
  }

  // Local variables
  const challenge = Isaac.GetChallenge();
  const devilVisited = g.run.seededSwap.devilVisited;
  const bookTouched = g.run.seededSwap.bookTouched;
  const coins = g.run.seededSwap.coins;
  const keys = g.run.seededSwap.keys;

  // Only swap things if we are playing a specific seed
  if (!playingOnSetSeed()) {
    return;
  }

  // Set everything back to the way it was before
  g.run.seededSwap.swapping = false;
  g.g.SetStateFlag(GameStateFlag.STATE_DEVILROOM_VISITED, devilVisited);
  g.g.SetStateFlag(GameStateFlag.STATE_BOOK_PICKED_UP, bookTouched);
  g.p.AddCoins(-99);
  g.p.AddCoins(coins);
  g.p.AddKeys(-99);
  g.p.AddKeys(keys);
  loadHealth();
}

// Based on the "REVEL.StoreHealth()" function in the Revelations mod
function saveHealth() {
  // Local variables
  const character = g.p.GetPlayerType();
  const soulHeartTypes: HeartSubType[] = [];
  let maxHearts = g.p.GetMaxHearts();
  let hearts = g.p.GetHearts();
  let soulHearts = g.p.GetSoulHearts();
  let boneHearts = g.p.GetBoneHearts();
  const goldenHearts = g.p.GetGoldenHearts();
  const eternalHearts = g.p.GetEternalHearts();
  const subPlayer = g.p.GetSubPlayer();

  // The Forgotten and The Soul has special health, so we need to account for this
  if (character === PlayerType.PLAYER_THEFORGOTTEN) {
    // The Forgotten does not have red heart containers
    maxHearts = boneHearts * 2;
    boneHearts = 0;

    // The Forgotten will always have 0 soul hearts;
    // we need to get the soul heart amount from the sub player
    soulHearts = subPlayer.GetSoulHearts();
  } else if (character === PlayerType.PLAYER_THESOUL) {
    // The Soul will always have 0 bone hearts;
    // we need to get the bone heart amount from the sub player
    // We need to store it as "maxHearts" instead of "boneHearts"
    maxHearts = subPlayer.GetBoneHearts() * 2;
    hearts = subPlayer.GetHearts();
  }

  // Eternal Hearts will be lost since we are about to change floors,
  // so convert it to other types of health
  // "eternalHearts" will be equal to 1 if we have an Eternal Heart
  if (
    character === PlayerType.PLAYER_XXX || // 4
    character === PlayerType.PLAYER_THESOUL // 17
  ) {
    soulHearts += eternalHearts * 2;
  } else {
    maxHearts += eternalHearts * 2;
    hearts += eternalHearts * 2;
  }

  // This is the number of individual hearts shown in the HUD, minus heart containers
  const extraHearts = math.ceil(soulHearts / 2) + boneHearts;

  // Since bone hearts can be inserted anywhere between soul hearts,
  // we need a separate counter to track which soul heart we're currently at
  let currentSoulHeart = 0;

  for (let i = 0; i < extraHearts; i++) {
    let isBoneHeart = g.p.IsBoneHeart(i);
    if (character === PlayerType.PLAYER_THEFORGOTTEN) {
      // 16
      isBoneHeart = subPlayer.IsBoneHeart(i);
    }
    if (isBoneHeart) {
      soulHeartTypes.push(HeartSubType.HEART_BONE);
    } else {
      // We need to add 1 here because only the second half of a black heart is considered black
      let isBlackHeart = g.p.IsBlackHeart(currentSoulHeart + 1);
      if (character === PlayerType.PLAYER_THEFORGOTTEN) {
        // 16
        isBlackHeart = subPlayer.IsBlackHeart(currentSoulHeart + 1);
      }
      if (isBlackHeart) {
        soulHeartTypes.push(HeartSubType.HEART_BLACK);
      } else {
        soulHeartTypes.push(HeartSubType.HEART_SOUL);
      }

      // Move to the next heart
      currentSoulHeart += 2;
    }
  }

  return {
    soulHeartTypes,
    maxHearts,
    hearts,
    soulHearts,
    boneHearts,
    goldenHearts,
  };
}

// Based on the "REVEL.LoadHealth()" function in the Revelations mod
function loadHealth() {
  // Local variables
  const character = g.p.GetPlayerType();
  const health = g.run.seededSwap.health;

  // Remove all existing health
  g.p.AddMaxHearts(-24, true);
  g.p.AddSoulHearts(-24);
  g.p.AddBoneHearts(-24);

  // Add the red heart containers
  if (character === PlayerType.PLAYER_THESOUL) {
    // 17
    // Account for The Soul, as adding health to him is a special case
    const subPlayer = g.p.GetSubPlayer();
    subPlayer.AddMaxHearts(health.maxHearts, false);
  } else {
    g.p.AddMaxHearts(health.maxHearts, false);
  }

  // Add the soul / black / bone hearts
  let soulHeartsRemaining = health.soulHearts;
  for (let i = 1; i <= health.soulHeartTypes.length; i++) {
    const heartType = health.soulHeartTypes[i - 1];
    const isHalf = health.soulHearts + health.boneHearts * 2 < i * 2;
    let addAmount = 2;
    if (
      isHalf ||
      heartType === HeartSubType.HEART_BONE ||
      soulHeartsRemaining < 2
    ) {
      // Fix the bug where a half soul heart to the left of a bone heart will be treated as a full
      // soul heart
      addAmount = 1;
    }

    if (heartType === HeartSubType.HEART_SOUL) {
      g.p.AddSoulHearts(addAmount);
      soulHeartsRemaining -= addAmount;
    } else if (heartType === HeartSubType.HEART_BLACK) {
      g.p.AddBlackHearts(addAmount);
      soulHeartsRemaining -= addAmount;
    } else if (heartType === HeartSubType.HEART_BONE) {
      g.p.AddBoneHearts(addAmount);
    }
  }

  // Fill in the red heart containers
  g.p.AddHearts(health.hearts);
  g.p.AddGoldenHearts(health.goldenHearts);
  // (no matter what kind of heart is added, no sounds effects will play)

  g.seeds.RemoveSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);
}
*/
