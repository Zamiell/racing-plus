import { ModCallback } from "isaac-typescript-definitions";
import { updateCachedAPIFunctions } from "../cache";
import { hasErrors } from "../classes/features/mandatory/checkErrors/v";
import { changeCharOrderPostRender } from "../features/changeCharOrder/callbacks/postRender";
import * as drawVersion from "../features/mandatory/drawVersion";
import * as modConfigNotify from "../features/mandatory/modConfigNotify";
import * as racingPlusSprite from "../features/mandatory/racingPlusSprite";
import * as runTimer from "../features/mandatory/runTimer";
import { seededDeathPostRender } from "../features/mandatory/seededDeath/callbacks/postRender";
import * as streakText from "../features/mandatory/streakText";
import * as topLeftText from "../features/mandatory/topLeftText";
import * as showEdenStartingItems from "../features/optional/characters/showEdenStartingItems";
import { fastTravelPostRender } from "../features/optional/major/fastTravel/callbacks/postRender";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";
import { automaticItemInsertionPostRender } from "../features/optional/quality/automaticItemInsertion/callbacks/postRender";
import { showDreamCatcherItemPostRender } from "../features/optional/quality/showDreamCatcherItem/callbacks/postRender";
import * as showMaxFamiliars from "../features/optional/quality/showMaxFamiliars";
import * as showPills from "../features/optional/quality/showPills";
import * as speedUpFadeIn from "../features/optional/quality/speedUpFadeIn";
import { racePostRender } from "../features/race/callbacks/postRender";
import * as customConsole from "../features/race/customConsole";
import { speedrunPostRender } from "../features/speedrun/callbacks/postRender";
import * as restartOnNextFrame from "../features/utils/restartOnNextFrame";
import * as timeConsoleUsed from "../features/utils/timeConsoleUsed";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_RENDER, main);
}

function main() {
  updateCachedAPIFunctions();

  if (restartOnNextFrame.isRestartingOnNextFrame()) {
    restartOnNextFrame.postRender();
    return;
  }

  // If there are any errors, we can skip the remainder of this function.
  if (hasErrors()) {
    return;
  }

  // For mod features that draw UI elements to the screen, we should early return if the HUD is not
  // visible. However, the game is considered to be paused during the room slide animation, so in
  // most cases, we do not want to check to see if the game is paused.

  // Utils
  timeConsoleUsed.postRender();

  // Mandatory
  modConfigNotify.postRender();
  streakText.postRender();
  runTimer.postRender();
  topLeftText.postRender();
  drawVersion.postRender();
  seededDeathPostRender();

  // Major
  racePostRender();
  speedrunPostRender();
  changeCharOrderPostRender();
  fastTravelPostRender();
  freeDevilItem.postRender();

  // Chars
  showEdenStartingItems.postRender();

  // QoL
  speedUpFadeIn.postRender();
  showDreamCatcherItemPostRender(); // 566
  showMaxFamiliars.postRender();
  // Should be after the "Show Max Familiars" feature so that the text has priority.
  automaticItemInsertionPostRender();
  showPills.postRender();

  // Other
  customConsole.postRender();

  // We want the "R+" sprite to be drawn on top of everything.
  racingPlusSprite.postRender();
}
