import {
  CollectibleType,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import { log, removeCollectibleFromItemTracker } from "isaacscript-common";
import { hasErrors } from "../../../classes/features/mandatory/checkErrors/v";
import { isSpeedrunWithRandomCharacterOrder } from "../../../classes/features/speedrun/RandomCharacterOrder";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import { g } from "../../../globals";
import {
  addCollectibleAndRemoveFromPools,
  giveTrinketAndRemoveFromPools,
} from "../../../utilsGlobals";
import { shouldBanFirstFloorTreasureRoom } from "../../mandatory/banFirstFloorRoomType";
import * as tempMoreOptions from "../../mandatory/tempMoreOptions";
import { spawnDroppedChildsHeart } from "../../optional/characters/samsonDropHeart";
import {
  isRestartingOnNextFrame,
  restartOnNextFrame,
  setRestartCharacter,
} from "../../utils/restartOnNextFrame";
import * as characterProgress from "../characterProgress";
import { speedrunResetPersistentVars } from "../resetVars";
import { season2PostGameStarted } from "../season2/callbacks/postGameStarted";
import { season3PostGameStarted } from "../season3/callbacks/postGameStarted";
import {
  checkValidCharOrder,
  getCurrentCharacter,
  getFirstCharacter,
  inSpeedrun,
  isOnFirstCharacter,
  onSeason,
} from "../speedrun";
import { speedrunResetFirstCharacterVars, v } from "../v";

export function speedrunPostGameStarted(): void {
  if (!inSpeedrun()) {
    speedrunResetPersistentVars();
    return;
  }

  // Force them back to the first character if there are any errors.
  if (hasErrors()) {
    speedrunResetPersistentVars();
    return;
  }

  if (v.persistent.resetAllVarsOnNextReset) {
    v.persistent.resetAllVarsOnNextReset = false;
    speedrunResetPersistentVars();
  }

  const challenge = Isaac.GetChallenge();
  if (challenge !== v.persistent.currentlyPlayingChallenge) {
    v.persistent.currentlyPlayingChallenge = challenge;
    speedrunResetPersistentVars();
  }

  liveSplitReset();

  if (isRestartingOnNextFrame()) {
    return;
  }

  if (!checkValidCharOrder()) {
    return;
  }

  if (setCorrectCharacter()) {
    return;
  }

  if (goBackToFirstCharacter()) {
    return;
  }

  speedrunResetFirstCharacterVars();
  characterProgress.postGameStarted();
  giveAchievementItems();

  season2PostGameStarted();
  season3PostGameStarted();

  // We give the More Options buff last in case one of the seasons grants a normal More Options.
  giveMoreOptionsBuff();
}

function liveSplitReset() {
  const player = Isaac.GetPlayer();

  if (v.persistent.liveSplitReset) {
    v.persistent.liveSplitReset = false;
    player.AddCollectible(CollectibleTypeCustom.RESET);
    log(
      `Reset the LiveSplit AutoSplitter by giving "Reset", item ID ${CollectibleTypeCustom.RESET}.`,
    );
    removeCollectibleFromItemTracker(CollectibleTypeCustom.RESET);
  }
}

/** @returns True if the current character was wrong. */
function setCorrectCharacter() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  // Character order is explicitly handled in some seasons.
  if (isSpeedrunWithRandomCharacterOrder()) {
    return false;
  }

  const currentCharacter = getCurrentCharacter();
  if (character !== currentCharacter) {
    v.persistent.performedFastReset = true;
    restartOnNextFrame();
    setRestartCharacter(currentCharacter);
    log(
      `Restarting because we are on character ${character} and we need to be on character ${currentCharacter}.`,
    );

    return true;
  }

  return false;
}

function goBackToFirstCharacter() {
  if (v.persistent.performedFastReset) {
    v.persistent.performedFastReset = false;
    return false;
  }

  if (isOnFirstCharacter()) {
    return false;
  }

  // They held R for a slow reset, and they are not on the first character, so they want to restart
  // from the first character.
  v.persistent.characterNum = 1;
  restartOnNextFrame();

  const firstCharacter = isSpeedrunWithRandomCharacterOrder()
    ? PlayerType.ISAAC
    : getFirstCharacter();
  setRestartCharacter(firstCharacter);

  log("Restarting because we want to start from the first character again.");

  // Tell the LiveSplit AutoSplitter to reset.
  v.persistent.liveSplitReset = true;

  return true;
}

/**
 * For some reason, characters do not start with items that are granted by achievements while in
 * challenges.
 */
function giveAchievementItems() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  switch (character) {
    // 0
    case PlayerType.ISAAC: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.D6);
      break;
    }

    // 2
    case PlayerType.CAIN: {
      giveTrinketAndRemoveFromPools(player, TrinketType.PAPER_CLIP);
      break;
    }

    // 5
    case PlayerType.EVE: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.RAZOR_BLADE);
      break;
    }

    // 6
    case PlayerType.SAMSON: {
      spawnDroppedChildsHeart(player);
      break;
    }

    // 10
    case PlayerType.LOST: {
      // Holy Mantle is not removed from pools while in a custom challenge.
      g.itemPool.RemoveCollectible(CollectibleType.HOLY_MANTLE);
      break;
    }

    // 14
    case PlayerType.KEEPER: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.WOODEN_NICKEL);
      giveTrinketAndRemoveFromPools(player, TrinketType.STORE_KEY);
      break;
    }

    default: {
      break;
    }
  }
}

function giveMoreOptionsBuff() {
  const player = Isaac.GetPlayer();

  // Only seasons with Treasure Rooms need the More Options buff.
  if (shouldBanFirstFloorTreasureRoom()) {
    return;
  }

  // The first character of the speedrun always gets a temporary More Options to speed up the
  // process of getting a run going. (On season 3, every character gets this temporary buff in order
  // to match how diversity races work.)
  if (isOnFirstCharacter() || onSeason(3)) {
    tempMoreOptions.give(player);
  }
}
