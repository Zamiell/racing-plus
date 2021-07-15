import * as streakText from "../features/mandatory/streakText";
import * as openHushDoor from "../features/optional/quality/openHushDoor";
import * as openMegaSatanDoor from "../features/optional/quality/openMegaSatanDoor";
import * as silenceMomDad from "../features/optional/sound/silenceMomDad";
import * as racePostNewLevel from "../features/race/callbacks/postNewLevel";
import g from "../globals";
import log from "../log";
import { getPlayers } from "../misc";
import * as saveDat from "../saveDat";
import GlobalsRunLevel from "../types/GlobalsRunLevel";
import * as postNewRoom from "./postNewRoom";

export function main(): void {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  log(
    `MC_POST_NEW_LEVEL - ${stage}.${stageType} (game frame ${gameFrameCount})`,
  );

  // Make sure the callbacks run in the right order
  // (naturally, PostNewLevel gets called before the PostGameStarted callbacks)
  if (gameFrameCount === 0 && !g.run.forceNextLevel) {
    return;
  }
  g.run.forceNextLevel = false;

  newLevel();
}

export function newLevel(): void {
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
    showLevelText();
  }

  // Major
  racePostNewLevel.main();

  // QoL
  openHushDoor.postNewLevel();
  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "Mega Satan"
  ) {
    openMegaSatanDoor.postNewLevel();
  }

  // Sounds
  silenceMomDad.postNewLevel();

  // Call PostNewRoom manually (they get naturally called out of order)
  postNewRoom.newRoom();
}

function shouldShowLevelText() {
  return (
    // If the race is finished, the "Victory Lap" text will overlap with the stage text,
    // so don't bother showing it
    !g.raceVars.finished &&
    // If one or more players are playing as "Random Baby", the baby descriptions will slightly
    // overlap with the stage text, so don't bother showing it
    !oneOrMorePlayersIsRandomBaby()
  );
}

function showLevelText() {
  // Show what the new floor is
  // (the game will not show this naturally after doing a "stage" console command)
  if (VanillaStreakText) {
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

function oneOrMorePlayersIsRandomBaby() {
  const randomBaby = Isaac.GetPlayerTypeByName("Random Baby");
  for (const player of getPlayers()) {
    const character = player.GetPlayerType();
    if (character === randomBaby) {
      return true;
    }
  }

  return false;
}
