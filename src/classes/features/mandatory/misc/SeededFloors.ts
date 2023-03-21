import {
  CollectibleType,
  GameStateFlag,
  HeartSubType,
  PlayerType,
  SeedEffect,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  PlayerHealth,
  characterCanHaveRedHearts,
  characterGetsBlackHeartFromEternalHeart,
  game,
  getPlayerHealth,
  getRandom,
  isCharacter,
  log,
  newRNG,
  removeAllPlayerHealth,
  repeat,
  setPlayerHealth,
} from "isaacscript-common";
import { inSeededRace } from "../../../../features/race/v";
import { config } from "../../../../modConfigMenu";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

interface GameStateFlags {
  devilRoomVisited: boolean;
  bookTouched: boolean;
}

interface Inventory {
  coins: int;
  bombs: int;
  keys: int;
}

const v = {
  run: {
    gameStateFlags: null as GameStateFlags | null,
    inventory: null as Inventory | null,
    playerHealth: null as PlayerHealth | null,
  },
};

/**
 * Different inventory and health conditions can affect special room generation. And different
 * special rooms can also sometimes change the actual room selection of non-special rooms. This is
 * bad for seeded races; we want to ensure consistent floors.
 *
 * Thus, we arbitrarily set inventory and health conditions before going to the next floor, and then
 * swap them back:
 * https://bindingofisaacrebirth.gamepedia.com/Level_Generation
 *
 * This feature is not configurable because it could change floors, causing a seed to be different.
 * This feature relies on fast travel to function.
 */
export class SeededFloors extends MandatoryModFeature {
  v = v;

  /**
   * We may have had the Curse of the Unknown seed enabled in a previous run, so ensure that it is
   * removed.
   */
  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    const seeds = game.GetSeeds();
    seeds.RemoveSeedEffect(SeedEffect.PERMANENT_CURSE_UNKNOWN);
  }
}

function shouldSeededFloorsApply() {
  return config.FastTravel && inSeededRace();
}

export function seededFloorsBefore(): void {
  if (!shouldSeededFloorsApply()) {
    return;
  }

  log("seededFloors - Before going to a new floor.");

  const level = game.GetLevel();
  const levelSeed = level.GetDungeonPlacementSeed();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const eternalHearts = player.GetEternalHearts();
  const rng = newRNG(levelSeed);

  // Record the current inventory and health values.
  v.run.gameStateFlags = getGameStateFlags();
  v.run.inventory = getInventory(player);
  v.run.playerHealth = getPlayerHealth(player);

  // Eternal Hearts will be lost since we are about to change floors, so convert it to other types
  // of health. `eternalHearts` will be equal to 1 if we have an Eternal Heart.
  if (characterCanHaveRedHearts(character)) {
    v.run.playerHealth.maxHearts += v.run.playerHealth.eternalHearts * 2;
    v.run.playerHealth.hearts += v.run.playerHealth.eternalHearts * 2;
  } else {
    const heartSubType = characterGetsBlackHeartFromEternalHeart(character)
      ? HeartSubType.BLACK
      : HeartSubType.SOUL;
    repeat(v.run.playerHealth.eternalHearts, () => {
      if (v.run.playerHealth === null) {
        return;
      }

      v.run.playerHealth.soulHearts += 2;
      v.run.playerHealth.soulHeartTypes.push(heartSubType);
    });
  }
  v.run.playerHealth.eternalHearts = 0;

  removeAllPlayerHealth(player);

  // Modification 1: Devil Room visited
  game.SetStateFlag(GameStateFlag.DEVIL_ROOM_VISITED, true);

  // `GameStateFlag.DEVIL_ROOM_VISITED` affects the chances of a Curse Room being generated.
  // However, in seeded races, we always start off the player with one Devil Room item taken (for
  // the consistent Devil/Angel room feature). Thus, default to always having this flag set to true,
  // which will result in slightly more Curse Rooms on the first two floors than normal, but that is
  // okay.

  // Modification 2: Book touched
  // - Vanilla is bugged so that the flag never gets set to true, so we copy this behavior and do
  //   nothing.

  // Modification 3: Coins
  const coinMod = getRandom(rng);
  player.AddCoins(-999);
  if (coinMod < 0.5) {
    // 50% chance to have 5 coins.
    player.AddCoins(5);
  }

  // Modification 4: Keys
  const keyMod = getRandom(rng);
  player.AddKeys(-99);
  if (keyMod < 0.5) {
    // 50% chance to get 2 keys.
    player.AddKeys(2);
  }

  // Modification 5: Full health (which always applies to characters who cannot have red heart
  // containers)
  if (characterCanHaveRedHearts(character)) {
    player.AddMaxHearts(2, false);
    player.AddHearts(1);
    const fullHealthMod = getRandom(rng);
    if (fullHealthMod < 0.66) {
      // 66% chance to be full health.
      player.AddHearts(1);
    }
  } else {
    // Give them one soul heart so that they do not die upon changing floors.
    player.AddSoulHearts(2);
  }

  // Modification 6: Critical health (which is defined as being at 1 heart or less)
  const criticalHealthMod = getRandom(rng);
  if (criticalHealthMod < 0.75) {
    // 75% chance to not be at critical health.
    if (characterCanHaveRedHearts(character)) {
      player.AddMaxHearts(2, false);
      player.AddHearts(2);
    } else {
      player.AddSoulHearts(2);
    }
  }

  // Add the eternal heart back so that the giantbook animation is triggered as per normal.
  if (eternalHearts > 0) {
    player.AddEternalHearts(eternalHearts);
  }
}

function getGameStateFlags(): GameStateFlags {
  const devilVisited = game.GetStateFlag(GameStateFlag.DEVIL_ROOM_VISITED);
  const bookPickedUp = game.GetStateFlag(GameStateFlag.BOOK_PICKED_UP);

  return {
    devilRoomVisited: devilVisited,
    bookTouched: bookPickedUp,
  };
}

function getInventory(player: EntityPlayer): Inventory {
  const coins = player.GetNumCoins();
  const bombs = player.GetNumBombs();
  const keys = player.GetNumKeys();

  return {
    coins,
    bombs,
    keys,
  };
}

export function seededFloorsAfter(): void {
  if (!shouldSeededFloorsApply()) {
    return;
  }

  log("seededFloors - After going to a new floor.");

  const player = Isaac.GetPlayer();

  // Set everything back to the way it was before.
  if (v.run.gameStateFlags !== null) {
    setGameStateFlags(v.run.gameStateFlags);
  }
  if (v.run.inventory !== null) {
    setInventory(player, v.run.inventory);
  }
  if (v.run.playerHealth !== null) {
    setPlayerHealth(player, v.run.playerHealth);
  }

  addExtraHealthFromItems(player);
  fixWhoreOfBabylon(player);

  const seeds = game.GetSeeds();
  seeds.RemoveSeedEffect(SeedEffect.PERMANENT_CURSE_UNKNOWN);
}

function setGameStateFlags(gameStateFlags: GameStateFlags) {
  game.SetStateFlag(
    GameStateFlag.DEVIL_ROOM_VISITED,
    gameStateFlags.devilRoomVisited,
  );
  game.SetStateFlag(GameStateFlag.BOOK_PICKED_UP, gameStateFlags.bookTouched);
}

function setInventory(player: EntityPlayer, inventory: Inventory) {
  player.AddCoins(99); // Make sure that Keeper is at full health.
  player.AddCoins(-999); // Removing coins does not affect Keeper's health.
  player.AddCoins(inventory.coins);
  player.AddBombs(-99);
  player.AddBombs(inventory.bombs);
  player.AddKeys(-99);
  player.AddKeys(inventory.keys);
}

function addExtraHealthFromItems(player: EntityPlayer) {
  addExtraHealthFromCollectibles(player);
  addExtraHealthFromTrinkets(player);
}

function addExtraHealthFromCollectibles(player: EntityPlayer) {
  const redHearts = player.GetHearts();

  // 566
  if (player.HasCollectible(CollectibleType.DREAM_CATCHER)) {
    // In vanilla, no matter how many Dream Catchers the player has, it will only grant 1 soul
    // heart.
    player.AddSoulHearts(1);
  }

  // 676
  if (player.HasCollectible(CollectibleType.EMPTY_HEART) && redHearts <= 2) {
    player.AddMaxHearts(2, true);
  }
}

function addExtraHealthFromTrinkets(player: EntityPlayer) {
  // 55
  const numMaggysFaith = player.GetTrinketMultiplier(TrinketType.MAGGYS_FAITH);
  player.AddEternalHearts(numMaggysFaith);

  // 168
  const numHollowHearts = player.GetTrinketMultiplier(TrinketType.HOLLOW_HEART);
  player.AddBoneHearts(numHollowHearts);
}

/** Restoring the player's health can result in a bugged Whore of Babylon state. */
function fixWhoreOfBabylon(player: EntityPlayer) {
  const effects = player.GetEffects();
  const hasWhoreEffect = effects.HasCollectibleEffect(
    CollectibleType.WHORE_OF_BABYLON,
  );
  const shouldHaveWhoreEffect = shouldWhoreOfBabylonApply(player);

  if (shouldHaveWhoreEffect && !hasWhoreEffect) {
    effects.AddCollectibleEffect(CollectibleType.WHORE_OF_BABYLON);
  } else if (!shouldHaveWhoreEffect && hasWhoreEffect) {
    effects.RemoveCollectibleEffect(CollectibleType.WHORE_OF_BABYLON);
  }
}

function shouldWhoreOfBabylonApply(player: EntityPlayer) {
  const hasWhore = player.HasCollectible(CollectibleType.WHORE_OF_BABYLON);
  const isEve = isCharacter(player, PlayerType.EVE);
  const hearts = player.GetHearts();
  const redHeartTriggerAmount = isEve ? 2 : 1;

  return hasWhore && hearts <= redHeartTriggerAmount;
}
