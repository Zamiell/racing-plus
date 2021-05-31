import g from "../globals";
import * as saveDat from "../saveDat";
import { SaveFileState } from "../types/enums";

export function main(): void {
  saveDat.load();

  if (g.saveFile.state === SaveFileState.NotChecked) {
    // In order to determine if the user has a fully-unlocked save file, we need to restart the game
    // Since we are continuing a run, that would destroy their current progress
    // Defer the check until the next new run starts
    g.saveFile.state = SaveFileState.DeferredUntilNewRunBegins;
  }
}
