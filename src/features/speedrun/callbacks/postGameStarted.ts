import { PlayerType } from "isaac-typescript-definitions";
import { log, removeCollectibleFromItemTracker } from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import { shouldBanFirstFloorTreasureRoom } from "../../mandatory/banFirstFloorRoomType";
import * as tempMoreOptions from "../../mandatory/tempMoreOptions";
import {
  isRestartingOnNextFrame,
  restartOnNextFrame,
  setRestartCharacter,
} from "../../utils/restartOnNextFrame";
import * as characterProgress from "../characterProgress";
import * as randomCharacterOrder from "../randomCharacterOrder";
import * as season1 from "../season1";
import { season2PostGameStarted } from "../season2/callbacks/postGameStarted";
import { season3PostGameStarted } from "../season3/callbacks/postGameStarted";
import {
  checkValidCharOrder,
  getCurrentCharacter,
  getFirstCharacter,
  inSpeedrun,
  isOnFirstCharacter,
} from "../speedrun";
import v, {
  speedrunHasErrors,
  speedrunResetFirstCharacterVars,
  speedrunResetPersistentVars,
} from "../v";

export function speedrunPostGameStarted(): void {
  if (!inSpeedrun()) {
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
  randomCharacterOrder.postGameStarted();

  if (speedrunHasErrors()) {
    return;
  }

  season1.postGameStarted();
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

/**
 * @returns True if the current character was wrong.
 */
function setCorrectCharacter() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  // Character order is explicitly handled in some seasons.
  if (randomCharacterOrder.isSpeedrunWithRandomCharacterOrder()) {
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

  const firstCharacter =
    randomCharacterOrder.isSpeedrunWithRandomCharacterOrder()
      ? PlayerType.ISAAC
      : getFirstCharacter();
  setRestartCharacter(firstCharacter);

  log("Restarting because we want to start from the first character again.");

  // Tell the LiveSplit AutoSplitter to reset.
  v.persistent.liveSplitReset = true;

  return true;
}

function giveMoreOptionsBuff() {
  const player = Isaac.GetPlayer();
  const challenge = Isaac.GetChallenge();

  // Only seasons with Treasure Rooms need the More Options buff.
  if (shouldBanFirstFloorTreasureRoom()) {
    return;
  }

  // The first character of the speedrun always gets a temporary More Options to speed up the
  // process of getting a run going. (On season 3, every character gets this temporary buff in order
  // to match how diversity races work.)
  if (isOnFirstCharacter() || challenge === ChallengeCustom.SEASON_3) {
    tempMoreOptions.give(player);
  }
}
