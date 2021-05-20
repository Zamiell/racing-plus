import * as cache from "../cache";
import * as customConsole from "../features/customConsole";
import * as fastReset from "../features/fastReset";
import * as race from "../features/race/main";
import * as saveFileCheck from "../features/saveFileCheck";
import * as speedrun from "../features/speedrun/main";
import g from "../globals";
import { consoleCommand } from "../misc";

export function main(): void {
  cache.updateAPIFunctions();

  if (checkRestart()) {
    return;
  }

  // Features
  customConsole.postRender();
  fastReset.postRender();
}

// Conditionally restart the game
// (e.g. if Easter Egg or character validation failed)
// (we can't do this in the "PostGameStarted" callback because the "restart" command will fail when
// the game is first loading)
function checkRestart() {
  if (!g.run.restart) {
    return false;
  }
  g.run.restart = false;

  if (saveFileCheck.checkRestart()) {
    return true;
  }

  if (race.checkRestartWrongCharacter()) {
    return true;
  }

  if (race.checkRestartWrongSeed()) {
    return true;
  }

  if (speedrun.checkRestartWrongCharacter()) {
    return true;
  }

  // Since no special conditions apply, just do a normal restart
  consoleCommand("restart");
  return true;
}
