import racePreGameExit from "../features/race/callbacks/preGameExit";
import g from "../globals";
import log, { debugLog } from "../log";
import * as saveDat from "../saveDat";
import GlobalsRun from "../types/GlobalsRun";

export function main(shouldSave: boolean): void {
  log("MC_PRE_GAME_EXIT");

  if (shouldSave) {
    saveDat.save();
    log("Saved variables.");
  } else {
    g.run = new GlobalsRun([]);
  }

  racePreGameExit();

  debugLog("MC_PRE_GAME_EXIT", false);
}
