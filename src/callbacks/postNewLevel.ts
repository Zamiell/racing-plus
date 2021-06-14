import * as streakText from "../features/mandatory/streakText";
import * as socket from "../features/optional/major/socket";
import * as openHushDoor from "../features/optional/quality/openHushDoor";
import * as silenceMomDad from "../features/optional/sound/silenceMomDad";
import * as racePostNewLevel from "../features/race/callbacks/postNewLevel";
import g from "../globals";
import { getPlayers, log } from "../misc";
import * as saveDat from "../saveDat";
import GlobalsRunLevel from "../types/GlobalsRunLevel";
import * as postNewRoom from "./postNewRoom";

export function main(): void {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  log(`MC_POST_NEW_LEVEL - ${stage}.${stageType}`);

  // Make sure the callbacks run in the right order
  // (naturally, PostNewLevel gets called before the PostGameStarted callbacks)
  if (gameFrameCount === 0) {
    return;
  }

  newLevel();
}

export function newLevel(): void {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  log(`MC_POST_NEW_LEVEL_2 - ${stage}.${stageType}`);

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
  socket.postNewLevel(stage, stageType);
  racePostNewLevel.main();

  // QoL
  openHushDoor.postNewLevel();

  // Sounds
  silenceMomDad.postNewLevel();

  // Call PostNewRoom manually (they get naturally called out of order)
  postNewRoom.newRoom();
}

function showLevelText() {
  // Show what the new floor is
  // (the game will not show this naturally after doing a "stage" console command)
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (VanillaStreakText) {
    g.l.ShowName(false);
  } else {
    let text = g.l.GetName(stage, stageType, 0, 0, false);
    if (text === "???") {
      text = "Blue Womb";
    }

    streakText.set(text);
  }
}

function shouldShowLevelText() {
  return (
    // If the race is finished, the "Victory Lap" text will overlap with the stage text,
    // so don't bother showing it
    !g.race.finished &&
    // If one or more players are playing as "Random Baby", the baby descriptions will slightly
    // overlap with the stage text, so don't bother showing it
    !oneOrMorePlayersIsRandomBaby()
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
