import {
  CHARACTERS_WITH_NO_RED_HEARTS,
  getFamiliars,
  getPlayerHealth,
  getRandom,
  isKeeper,
  nextSeed,
  onSetSeed,
  PlayerHealth,
  removeAllPlayerHealth,
  saveDataManager,
  setPlayerHealth,
} from "isaacscript-common";
import g from "../../globals";
import { config } from "../../modConfigMenu";

// This feature is not configurable because it could change floors, causing a seed to be different
// This feature relies on fast travel to function

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
    playerHealth: null as PlayerHealth | null,
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
  // We may have had the Curse of the Unknown seed enabled in a previous run,
  // so ensure that it is removed
  g.seeds.RemoveSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);

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
  const eternalHearts = player.GetEternalHearts();
  let seed = g.l.GetDungeonPlacementSeed();

  // Record the current inventory and health values
  v.run.swapping = true;
  v.run.gameStateFlags = getGameStateFlags();
  v.run.inventory = getInventory(player);
  v.run.playerHealth = getPlayerHealth(player);

  // Eternal Hearts will be lost since we are about to change floors,
  // so convert it to other types of health
  // "eternalHearts" will be equal to 1 if we have an Eternal Heart
  if (CHARACTERS_WITH_NO_RED_HEARTS.has(character)) {
    v.run.playerHealth.soulHearts += v.run.playerHealth.eternalHearts * 2;
  } else {
    v.run.playerHealth.maxHearts += v.run.playerHealth.eternalHearts * 2;
    v.run.playerHealth.hearts += v.run.playerHealth.eternalHearts * 2;
  }
  v.run.playerHealth.eternalHearts = 0;

  // Modification 1: Devil Room visited
  if (stage < 3) {
    g.g.SetStateFlag(GameStateFlag.STATE_DEVILROOM_VISITED, false);
  } else {
    g.g.SetStateFlag(GameStateFlag.STATE_DEVILROOM_VISITED, true);
  }

  // Modification 2: Book touched
  seed = nextSeed(seed);
  const bookMod = getRandom(seed);
  if (bookMod < 0.5) {
    g.g.SetStateFlag(GameStateFlag.STATE_BOOK_PICKED_UP, false);
  } else {
    g.g.SetStateFlag(GameStateFlag.STATE_BOOK_PICKED_UP, true);
  }

  // Modification 3: Coins
  seed = nextSeed(seed);
  const coinMod = getRandom(seed);
  player.AddCoins(-99);
  if (coinMod < 0.5) {
    // 50% chance to have 5 coins
    // (we give 20 in case Greed's Gullet and empty heart containers)
    player.AddCoins(20);
  }

  // Modification 4: Keys
  seed = nextSeed(seed);
  const keyMod = getRandom(seed);
  player.AddKeys(-99);
  if (keyMod < 0.5) {
    // 50% chance to get 2 keys
    player.AddKeys(2);
  }

  // Remove all health
  removeAllPlayerHealth(player);

  // Modification 5: Full health
  player.AddMaxHearts(2, false);
  player.AddHearts(1);
  seed = nextSeed(seed);
  const fullHealthMod = getRandom(seed);
  if (fullHealthMod < 0.66) {
    // 66% chance to be full health
    player.AddHearts(1);
  }

  // Modification 6: Critical health
  seed = nextSeed(seed);
  const criticalHealthMod = getRandom(seed);
  if (criticalHealthMod < 0.75) {
    // 75% chance to not be at critical health
    player.AddSoulHearts(2);

    // Keeper will get 3 Blue Flies from this, so manually remove them
    if (isKeeper(player)) {
      const blueFlies = getFamiliars(FamiliarVariant.BLUE_FLY);
      for (let i = 0; i < blueFlies.length; i++) {
        if (i >= 3) {
          break;
        }
        const blueFly = blueFlies[i];
        blueFly.Remove();
      }
    }
  }

  // Add any eternal hearts back so that the giantbook animation is triggered as per normal
  player.AddEternalHearts(eternalHearts);
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
  if (v.run.playerHealth !== null) {
    setPlayerHealth(player, v.run.playerHealth);
  }

  g.seeds.RemoveSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);
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
