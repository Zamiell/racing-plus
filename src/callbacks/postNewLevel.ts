import * as openHushDoor from "../features/optional/quality/openHushDoor";
import g from "../globals";
import { log } from "../misc";
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

  // Features
  openHushDoor.postNewLevel();

  // Call PostNewRoom manually (they get naturally called out of order)
  postNewRoom.newRoom();
}
