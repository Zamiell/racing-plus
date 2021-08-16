import * as cache from "../cache";
import changeCharOrderPostRender from "../features/changeCharOrder/callbacks/postRender";
import * as detectSlideAnimation from "../features/mandatory/detectSlideAnimation";
import * as errors from "../features/mandatory/errors";
import * as racingPlusSprite from "../features/mandatory/racingPlusSprite";
import * as runTimer from "../features/mandatory/runTimer";
import * as streakText from "../features/mandatory/streakText";
import * as topLeftText from "../features/mandatory/topLeftText";
import * as fastReset from "../features/optional/major/fastReset";
import fastTravelPostRender from "../features/optional/major/fastTravel/callbacks/postRender";
import * as automaticItemInsertion from "../features/optional/quality/automaticItemInsertion/automaticItemInsertion";
import * as customConsole from "../features/optional/quality/customConsole";
import showDreamCatcherItemPostRender from "../features/optional/quality/showDreamCatcherItem/callbacks/postRender";
import * as showEdenStartingItems from "../features/optional/quality/showEdenStartingItems";
import * as showMaxFamiliars from "../features/optional/quality/showMaxFamiliars";
import * as showPills from "../features/optional/quality/showPills";
import * as speedUpFadeIn from "../features/optional/quality/speedUpFadeIn";
import racePostRender, {
  checkRestartWrongRaceCharacter,
  checkRestartWrongRaceSeed,
} from "../features/race/callbacks/postRender";
import speedrunPostRender, {
  checkRestartWrongSpeedrunCharacter,
} from "../features/speedrun/callbacks/postRender";
import g from "../globals";
import { consoleCommand } from "../util";

export function main(): void {
  cache.updateAPIFunctions();

  if (checkRestart()) {
    return;
  }

  // If there are any errors, we can skip the remainder of this function
  if (errors.postRender()) {
    return;
  }

  // Mandatory features
  racingPlusSprite.postRender();
  detectSlideAnimation.postRender();
  streakText.postRender();
  runTimer.postRender();
  topLeftText.postRender();

  // Major features
  racePostRender();
  speedrunPostRender();
  changeCharOrderPostRender();
  fastTravelPostRender();
  fastReset.postRender();

  // Quality of life
  speedUpFadeIn.postRender();
  showEdenStartingItems.postRender();
  showDreamCatcherItemPostRender();
  showMaxFamiliars.postRender();
  // Should be after the "Show Max Familiars" feature so that the text has priority
  automaticItemInsertion.postRender();
  showPills.postRender();
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

  if (checkRestartWrongRaceCharacter()) {
    return true;
  }

  if (checkRestartWrongRaceSeed()) {
    return true;
  }

  if (checkRestartWrongSpeedrunCharacter()) {
    return true;
  }

  // Since no special conditions apply, just do a normal restart
  consoleCommand("restart");
  return true;
}
