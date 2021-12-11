import { updateCachedAPIFunctions } from "../cache";
import { changeCharOrderPostRender } from "../features/changeCharOrder/callbacks/postRender";
import * as drawVersion from "../features/mandatory/drawVersion";
import * as errors from "../features/mandatory/errors";
import * as modConfigNotify from "../features/mandatory/modConfigNotify";
import * as racingPlusSprite from "../features/mandatory/racingPlusSprite";
import * as roomVisiter from "../features/mandatory/roomVisiter";
import * as runTimer from "../features/mandatory/runTimer";
import * as streakText from "../features/mandatory/streakText";
import * as topLeftText from "../features/mandatory/topLeftText";
import * as showEdenStartingItems from "../features/optional/characters/showEdenStartingItems";
import * as autofire from "../features/optional/hotkeys/autofire";
import * as fastDrop from "../features/optional/hotkeys/fastDrop";
import * as schoolbagSwitch from "../features/optional/hotkeys/schoolbagSwitch";
import * as fastReset from "../features/optional/major/fastReset";
import { fastTravelPostRender } from "../features/optional/major/fastTravel/callbacks/postRender";
import * as customConsole from "../features/optional/other/customConsole";
import * as roll from "../features/optional/other/roll";
import * as automaticItemInsertion from "../features/optional/quality/automaticItemInsertion/automaticItemInsertion";
import * as azazelsRageChargeBar from "../features/optional/quality/azazelsRageChargeBar";
import * as leadPencilChargeBar from "../features/optional/quality/leadPencilChargeBar";
import { showDreamCatcherItemPostRender } from "../features/optional/quality/showDreamCatcherItem/callbacks/postRender";
import * as showMaxFamiliars from "../features/optional/quality/showMaxFamiliars";
import * as showPills from "../features/optional/quality/showPills";
import * as speedUpFadeIn from "../features/optional/quality/speedUpFadeIn";
import { racePostRender } from "../features/race/callbacks/postRender";
import { speedrunPostRender } from "../features/speedrun/callbacks/postRender";
import * as detectSlideAnimation from "../features/util/detectSlideAnimation";
import * as restartOnNextFrame from "../features/util/restartOnNextFrame";

export function main(): void {
  updateCachedAPIFunctions();

  if (restartOnNextFrame.isRestartingOnNextFrame()) {
    restartOnNextFrame.postRender();
    return;
  }

  // If there are any errors, we can skip the remainder of this function
  if (errors.postRender()) {
    return;
  }

  // Mandatory
  modConfigNotify.postRender();
  racingPlusSprite.postRender();
  detectSlideAnimation.postRender();
  streakText.postRender();
  runTimer.postRender();
  topLeftText.postRender();
  drawVersion.postRender();
  roomVisiter.postRender();

  // Major
  racePostRender();
  speedrunPostRender();
  changeCharOrderPostRender();
  fastTravelPostRender();
  fastReset.postRender();

  // Chars
  showEdenStartingItems.postRender();

  // QoL
  speedUpFadeIn.postRender();
  leadPencilChargeBar.postRender(); // 444
  showDreamCatcherItemPostRender(); // 566
  azazelsRageChargeBar.postRender(); // 699
  showMaxFamiliars.postRender();
  // Should be after the "Show Max Familiars" feature so that the text has priority
  automaticItemInsertion.postRender();
  showPills.postRender();

  // Hotkeys
  fastDrop.postRender();
  schoolbagSwitch.postRender();
  autofire.postRender();
  customConsole.postRender();
  roll.postRender();
}
