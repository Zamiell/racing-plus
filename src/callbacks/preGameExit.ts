import * as socket from "../features/optional/major/socket";
import g from "../globals";
import * as saveDat from "../saveDat";
import GlobalsRun from "../types/GlobalsRun";

export function main(shouldSave: boolean): void {
  if (shouldSave) {
    saveDat.save();
  } else {
    g.run = new GlobalsRun([]);
  }

  socket.preGameExit();
}
