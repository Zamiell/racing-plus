// This feature is not configurable because it could change floors, causing a seed to be different
// This feature relies on fast travel to function

import {
  CHARACTERS_WITH_NO_RED_HEARTS,
  getRandom,
  onSetSeed,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";
import { config } from "../../modConfigMenu";
import { incrementRNG } from "../../util";

interface Health {
  soulHeartTypes: HeartSubType[];
  maxHearts: int;
  hearts: int;
  soulHearts: int;
  boneHearts: int;
  goldenHearts: int;
  rottenHearts: int;
}

interface GameStateFlags {
  devilVisited: boolean;
  bookTouched: boolean;
}

interface Inventory {
  coins: int;
  keys: int;
}

const v = {
  run: {
    swapping: false,
    gameStateFlags: null as GameStateFlags | null,
    inventory: null as Inventory | null,
    health: null as Health | null,
  },
};

export function init(): void {
  saveDataManager("seededFloors", v, featureEnabled);
}

function featureEnabled() {
  return config.fastTravel;
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (onSetSeed()) {
    // Remove certain trinkets that mess up floor generation
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_SILVER_DOLLAR); // 110
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_BLOODY_CROWN); // 111
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_TELESCOPE_LENS); // 152
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_HOLY_CROWN); // 155
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_WICKED_CROWN); // 161
  }
}

// Different inventory and health conditions can affect special room generation
// Different special rooms can also sometimes change the actual room selection of non-special rooms
// This is bad for seeded races; we want to ensure consistent floors
// Thus, we arbitrarily set inventory and health conditions before going to the next floor,
// and then swap them back
// https://bindingofisaacrebirth.gamepedia.com/Level_Generation
export function before(stage: int): void {
  // Only swap things if we are playing a specific seed
  if (!onSetSeed()) {
    return;
  }

  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const goldenHearts = player.GetGoldenHearts();
  let seed = g.l.GetDungeonPlacementSeed();

  // Record the current inventory and health values
  v.run.swapping = true;
  v.run.gameStateFlags = getGameStateFlags();
  v.run.inventory = getInventory(player);
  v.run.health = getHealth(player);

  // Modification 1: Devil Room visited
  if (stage < 3) {
    g.g.SetStateFlag(GameStateFlag.STATE_DEVILROOM_VISITED, false);
  } else {
    g.g.SetStateFlag(GameStateFlag.STATE_DEVILROOM_VISITED, true);
  }

  // Modification 2: Book touched
  seed = incrementRNG(seed);
  const bookMod = getRandom(seed);
  if (bookMod < 0.5) {
    g.g.SetStateFlag(GameStateFlag.STATE_BOOK_PICKED_UP, false);
  } else {
    g.g.SetStateFlag(GameStateFlag.STATE_BOOK_PICKED_UP, true);
  }

  // Modification 3: Coins
  seed = incrementRNG(seed);
  const coinMod = getRandom(seed);
  player.AddCoins(-99);
  if (coinMod < 0.5) {
    // 50% chance to have 5 coins
    // (we give 20 in case Greed's Gullet and empty heart containers)
    player.AddCoins(20);
  }

  // Modification 4: Keys
  seed = incrementRNG(seed);
  const keyMod = getRandom(seed);
  player.AddKeys(-99);
  if (keyMod < 0.5) {
    // 50% chance to get 2 keys
    player.AddKeys(2);
  }

  // Remove all health
  g.seeds.AddSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);
  // (we hide the health UI in case they are using Forget Me Now)
  player.AddGoldenHearts(goldenHearts * -1);
  // (we have to remove the exact amount of Golden Hearts or else it will bug out)
  // (we remove Golden Hearts first so that they don't break)
  player.AddMaxHearts(-24, false);
  player.AddSoulHearts(-24);
  player.AddBoneHearts(-12);

  // Modification 5: Full health
  player.AddMaxHearts(2, false);
  player.AddHearts(1);
  seed = incrementRNG(seed);
  const fullHealthMod = getRandom(seed);
  if (fullHealthMod < 0.66) {
    // 66% chance to be full health
    player.AddHearts(1);
  }

  // Modification 6: Critical health
  seed = incrementRNG(seed);
  const criticalHealthMod = getRandom(seed);
  if (criticalHealthMod < 0.75) {
    // 75% chance to not be at critical health
    player.AddSoulHearts(2);

    // Keeper will get 3 Blue Flies from this, so manually remove them
    if (
      character === PlayerType.PLAYER_KEEPER ||
      character === PlayerType.PLAYER_KEEPER_B
    ) {
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
  // Only swap things if we are playing a specific seed
  if (!onSetSeed()) {
    return;
  }

  const player = Isaac.GetPlayer();

  // Set everything back to the way it was before
  v.run.swapping = false;
  if (v.run.gameStateFlags !== null) {
    setGameStateFlags(v.run.gameStateFlags);
  }
  if (v.run.inventory !== null) {
    setInventory(player, v.run.inventory);
  }
  if (v.run.health !== null) {
    setHealth(player, v.run.health);
  }
}

function getGameStateFlags(): GameStateFlags {
  const devilVisited = g.g.GetStateFlag(GameStateFlag.STATE_DEVILROOM_VISITED);
  const bookTouched = g.g.GetStateFlag(GameStateFlag.STATE_BOOK_PICKED_UP);

  return {
    devilVisited,
    bookTouched,
  };
}

function setGameStateFlags(gameStateFlags: GameStateFlags) {
  g.g.SetStateFlag(
    GameStateFlag.STATE_DEVILROOM_VISITED,
    gameStateFlags.devilVisited,
  );
  g.g.SetStateFlag(
    GameStateFlag.STATE_BOOK_PICKED_UP,
    gameStateFlags.bookTouched,
  );
}

function getInventory(player: EntityPlayer): Inventory {
  const coins = player.GetNumCoins();
  const keys = player.GetNumKeys();

  return {
    coins,
    keys,
  };
}

function setInventory(player: EntityPlayer, inventory: Inventory) {
  player.AddCoins(-99);
  player.AddCoins(inventory.coins);
  player.AddKeys(-99);
  player.AddKeys(inventory.keys);
}

// Based on the "REVEL.StoreHealth()" function in the Revelations mod
function getHealth(player: EntityPlayer): Health {
  const character = player.GetPlayerType();
  const soulHeartTypes: HeartSubType[] = [];
  let maxHearts = player.GetMaxHearts();
  let hearts = player.GetHearts();
  let soulHearts = player.GetSoulHearts();
  let boneHearts = player.GetBoneHearts();
  const goldenHearts = player.GetGoldenHearts();
  const eternalHearts = player.GetEternalHearts();
  const rottenHearts = player.GetRottenHearts();
  const subPlayer = player.GetSubPlayer();

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
  if (CHARACTERS_WITH_NO_RED_HEARTS.includes(character)) {
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
    let isBoneHeart = player.IsBoneHeart(i);
    if (character === PlayerType.PLAYER_THEFORGOTTEN) {
      // 16
      isBoneHeart = subPlayer.IsBoneHeart(i);
    }
    if (isBoneHeart) {
      soulHeartTypes.push(HeartSubType.HEART_BONE);
    } else {
      // We need to add 1 here because only the second half of a black heart is considered black
      let isBlackHeart = player.IsBlackHeart(currentSoulHeart + 1);
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
    rottenHearts,
  };
}

// Based on the "REVEL.LoadHealth()" function in the Revelations mod
function setHealth(player: EntityPlayer, health: Health) {
  const character = player.GetPlayerType();

  // Remove all existing health
  player.AddMaxHearts(-24, true);
  player.AddSoulHearts(-24);
  player.AddBoneHearts(-24);

  // Add the red heart containers
  if (character === PlayerType.PLAYER_THESOUL) {
    // 17
    // Account for The Soul, as adding health to him is a special case
    const subPlayer = player.GetSubPlayer();
    subPlayer.AddMaxHearts(health.maxHearts, false);
  } else {
    player.AddMaxHearts(health.maxHearts, false);
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
      player.AddSoulHearts(addAmount);
      soulHeartsRemaining -= addAmount;
    } else if (heartType === HeartSubType.HEART_BLACK) {
      player.AddBlackHearts(addAmount);
      soulHeartsRemaining -= addAmount;
    } else if (heartType === HeartSubType.HEART_BONE) {
      player.AddBoneHearts(addAmount);
    }
  }

  // Fill in the red heart containers
  player.AddHearts(health.hearts);
  player.AddGoldenHearts(health.goldenHearts);
  // (no matter what kind of heart is added, no sounds effects will play)
  player.AddRottenHearts(health.rottenHearts);

  g.seeds.RemoveSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);
}
