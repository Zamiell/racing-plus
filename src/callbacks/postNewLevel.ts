import { anyPlayerIs, log } from "isaacscript-common";
import { debugLog } from "../debugLog";
import * as streakText from "../features/mandatory/streakText";
import * as openHushDoor from "../features/optional/quality/openHushDoor";
import * as silenceMomDad from "../features/optional/sound/silenceMomDad";
import racePostNewLevel from "../features/race/callbacks/postNewLevel";
import g from "../globals";
import * as saveDat from "../saveDat";
import GlobalsRunLevel from "../types/GlobalsRunLevel";
import { isAntibirthStage } from "../utilGlobals";
import * as postNewRoom from "./postNewRoom";

export function main(): void {
  debugLog("MC_POST_NEW_LEVEL", true);

  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  log(
    `MC_POST_NEW_LEVEL - ${stage}.${stageType} (game frame ${gameFrameCount})`,
  );

  // Make sure the callbacks run in the right order
  // (naturally, PostNewLevel gets called before the PostGameStarted callbacks)
  if (gameFrameCount === 0 && !g.run.forceNextLevel) {
    debugLog("MC_POST_NEW_LEVEL", false);
    return;
  }
  g.run.forceNextLevel = false;

  newLevel();

  debugLog("MC_POST_NEW_LEVEL", false);
}

export function newLevel(): void {
  debugLog("MC_POST_NEW_LEVEL2", true);

  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  log(
    `MC_POST_NEW_LEVEL_2 - ${stage}.${stageType} (game frame ${gameFrameCount})`,
  );

  // Clear variables that track things per level
  g.run.level = new GlobalsRunLevel(stage, stageType);

  // Internally, the game saves the run state at the beginning of every floor
  // Mimic this functionality with our own mod data
  saveDat.save();

  // Other miscellaneous things
  if (shouldShowLevelText()) {
    showLevelText(stage);
  }

  // Major
  racePostNewLevel();

  // Quality of life
  openHushDoor.postNewLevel();

  // Sounds
  silenceMomDad.postNewLevel();

  // Call PostNewRoom manually (they get naturally called out of order)
  postNewRoom.newRoom();

  debugLog("MC_POST_NEW_LEVEL2", false);
}

function shouldShowLevelText() {
  const randomBaby = Isaac.GetPlayerTypeByName("Random Baby");

  return (
    // If the race is finished, the "Victory Lap" text will overlap with the stage text,
    // so don't bother showing it
    !g.raceVars.finished &&
    // If one or more players are playing as "Random Baby", the baby descriptions will slightly
    // overlap with the stage text, so don't bother showing it
    !anyPlayerIs(randomBaby)
  );
}

function showLevelText(stage: int) {
  // Show what the new floor is
  // (the game will not show this naturally after doing a "stage" console command)
  if (VanillaStreakText && (stage !== 1 || isAntibirthStage())) {
    g.l.ShowName(false);
  } else if (!goingToRaceRoom()) {
    const text = getLevelText();
    streakText.set(text);
  }
}

function getLevelText() {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (stage === 9) {
    return "Blue Womb";
  }

  return g.l.GetName(stage, stageType);
}

function goingToRaceRoom() {
  const stage = g.l.GetStage();

  return (
    g.race.status === "open" &&
    stage === 1 &&
    (g.run.roomsEntered === 0 || g.run.roomsEntered === 1)
  );
}
