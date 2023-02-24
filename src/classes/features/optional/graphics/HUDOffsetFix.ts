import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class HUDOffsetFix extends ConfigurableModFeature {
  configKey: keyof Config = "HUDOffsetFix";

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (Options.HUDOffset === 1) {
      Options.HUDOffset = 0;
    }
  }
}
