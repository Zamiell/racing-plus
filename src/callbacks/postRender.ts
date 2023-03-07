import { ModCallback } from "isaac-typescript-definitions";
import { hasErrors } from "../classes/features/mandatory/misc/checkErrors/v";
import { seededDeathPostRender } from "../features/mandatory/seededDeath/callbacks/postRender";
import * as streakText from "../features/mandatory/streakText";
import { fastTravelPostRender } from "../features/optional/major/fastTravel/callbacks/postRender";
import { showDreamCatcherItemPostRender } from "../features/optional/quality/showDreamCatcherItem/callbacks/postRender";
import { racePostRender } from "../features/race/callbacks/postRender";
import * as customConsole from "../features/race/customConsole";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_RENDER, main);
}

function main() {
  // If there are any errors, we can skip the remainder of this function.
  if (hasErrors()) {
    return;
  }

  // Mandatory
  streakText.postRender();
  seededDeathPostRender();

  // Major
  racePostRender();
  fastTravelPostRender();

  // QoL
  showDreamCatcherItemPostRender(); // 566

  // Other
  customConsole.postRender();
}
