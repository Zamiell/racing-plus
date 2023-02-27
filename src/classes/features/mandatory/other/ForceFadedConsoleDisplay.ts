import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

/**
 * Force the "faded console display" feature to be turned on, so that end-users can report bugs
 * easier.
 */
export class ForceFadedConsoleDisplay extends MandatoryModFeature {
  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    Options.FadedConsoleDisplay = true;
  }
}
