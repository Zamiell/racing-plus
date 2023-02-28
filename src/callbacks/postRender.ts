import { ModCallback } from "isaac-typescript-definitions";
import { hasErrors } from "../classes/features/mandatory/misc/checkErrors/v";
import { changeCharOrderPostRender } from "../features/changeCharOrder/callbacks/postRender";
import * as modConfigNotify from "../features/mandatory/modConfigNotify";
import { seededDeathPostRender } from "../features/mandatory/seededDeath/callbacks/postRender";
import * as streakText from "../features/mandatory/streakText";
import * as topLeftText from "../features/mandatory/topLeftText";
import { fastTravelPostRender } from "../features/optional/major/fastTravel/callbacks/postRender";
import { automaticItemInsertionPostRender } from "../features/optional/quality/automaticItemInsertion/callbacks/postRender";
import { showDreamCatcherItemPostRender } from "../features/optional/quality/showDreamCatcherItem/callbacks/postRender";
import { racePostRender } from "../features/race/callbacks/postRender";
import * as customConsole from "../features/race/customConsole";
import { speedrunPostRender } from "../features/speedrun/callbacks/postRender";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_RENDER, main);
}

function main() {
  // If there are any errors, we can skip the remainder of this function.
  if (hasErrors()) {
    return;
  }

  // For mod features that draw UI elements to the screen, we should early return if the HUD is not
  // visible. However, the game is considered to be paused during the room slide animation, so in
  // most cases, we do not want to check to see if the game is paused.

  // Mandatory
  modConfigNotify.postRender();
  streakText.postRender();
  topLeftText.postRender();
  seededDeathPostRender();

  // Major
  racePostRender();
  speedrunPostRender();
  changeCharOrderPostRender();
  fastTravelPostRender();

  // QoL
  showDreamCatcherItemPostRender(); // 566

  // Should be after the "Show Max Familiars" feature so that the text has priority.
  automaticItemInsertionPostRender();

  // Other
  customConsole.postRender();
}
