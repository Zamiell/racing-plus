import * as cache from "../cache";
import * as detectSlideAnimation from "../features/mandatory/detectSlideAnimation";
import * as errors from "../features/mandatory/errors";
import * as racingPlusSprite from "../features/mandatory/racingPlusSprite";
import * as runTimer from "../features/mandatory/runTimer";
import * as saveFileCheck from "../features/mandatory/saveFileCheck";
import * as streakText from "../features/mandatory/streakText";
import * as fastReset from "../features/optional/major/fastReset";
import * as fastTravelPostRender from "../features/optional/major/fastTravel/callbacks/postRender";
import * as socket from "../features/optional/major/socket";
import * as customConsole from "../features/optional/quality/customConsole";
import * as showDreamCatcherItemPostRender from "../features/optional/quality/showDreamCatcherItem/postRender";
import * as showEdenStartingItems from "../features/optional/quality/showEdenStartingItems";
import * as showMaxFamiliars from "../features/optional/quality/showMaxFamiliars";
import * as showPills from "../features/optional/quality/showPills";
import * as speedUpFadeIn from "../features/optional/quality/speedUpFadeIn";
import * as racePostRender from "../features/race/callbacks/postRender";
import * as speedrunPostRender from "../features/speedrun/callbacks/postRender";
import g from "../globals";
import { consoleCommand } from "../misc";

export function main(): void {
  cache.updateAPIFunctions();

  if (checkRestart()) {
    return;
  }

  speedUpFadeIn.postRender();

  // If there are any errors, we can skip the remainder of this function
  if (errors.postRender()) {
    return;
  }

  // Mandatory features
  racingPlusSprite.postRender();
  detectSlideAnimation.postRender();
  streakText.postRender();
  runTimer.postRender();

  // Optional features - Major
  socket.postRender();
  fastTravelPostRender.main();
  fastReset.postRender();

  // Optional features - Quality of Life
  showEdenStartingItems.postRender();
  showDreamCatcherItemPostRender.main();
  showPills.postRender();
  showMaxFamiliars.postRender();
  customConsole.postRender();
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

  if (racePostRender.checkRestartWrongCharacter()) {
    return true;
  }

  if (racePostRender.checkRestartWrongSeed()) {
    return true;
  }

  if (speedrunPostRender.checkRestartWrongCharacter()) {
    return true;
  }

  // Since no special conditions apply, just do a normal restart
  consoleCommand("restart");
  return true;
}
