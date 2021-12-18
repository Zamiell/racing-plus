import { log, removeCollectibleFromItemTracker } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../types/CollectibleTypeCustom";
import * as tempMoreOptions from "../../mandatory/tempMoreOptions";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../../util/restartOnNextFrame";
import * as characterProgress from "../characterProgress";
import * as season1 from "../season1";
import {
  checkValidCharOrder,
  getCurrentCharacter,
  getFirstCharacter,
  inSpeedrun,
  isOnFirstCharacter,
} from "../speedrun";
import v, { resetFirstCharacterVars, resetPersistentVars } from "../v";

export function speedrunPostGameStarted(): void {
  if (!inSpeedrun()) {
    resetPersistentVars();
    return;
  }

  liveSplitReset();

  if (!checkValidCharOrder()) {
    return;
  }

  if (setCorrectCharacter()) {
    return;
  }

  if (goBackToFirstCharacter()) {
    return;
  }

  resetFirstCharacterVars();
  giveMoreOptionsBuff();
  characterProgress.postGameStarted();
  season1.postGameStarted();
}

function liveSplitReset() {
  const player = Isaac.GetPlayer();

  if (v.persistent.liveSplitReset) {
    v.persistent.liveSplitReset = false;
    player.AddCollectible(CollectibleTypeCustom.COLLECTIBLE_RESET);
    log(
      `Reset the LiveSplit AutoSplitter by giving "Reset", item ID ${CollectibleTypeCustom.COLLECTIBLE_RESET}.`,
    );
    removeCollectibleFromItemTracker(CollectibleTypeCustom.COLLECTIBLE_RESET);
  }
}

function setCorrectCharacter() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
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

  // They held R for a slow reset, and they are not on the first character,
  // so they want to restart from the first character
  v.persistent.characterNum = 1;
  restartOnNextFrame();
  const firstCharacter = getFirstCharacter();
  setRestartCharacter(firstCharacter);
  log("Restarting because we want to start from the first character again.");

  // Tell the LiveSplit AutoSplitter to reset
  v.persistent.liveSplitReset = true;

  return true;
}

function giveMoreOptionsBuff() {
  const player = Isaac.GetPlayer();

  // The first character of the speedrun always gets More Options to speed up the process of getting
  // a run going
  if (isOnFirstCharacter()) {
    tempMoreOptions.give(player);
  }
}
