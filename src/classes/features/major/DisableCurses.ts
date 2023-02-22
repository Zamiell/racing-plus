import { LevelCurse, ModCallback } from "isaac-typescript-definitions";
import { bitFlags, Callback } from "isaacscript-common";
import { Config } from "../../Config";
import { ConfigurableModFeature } from "../../ConfigurableModFeature";

export class DisableCurses extends ConfigurableModFeature {
  configKey: keyof Config = "DisableCurses";

  @Callback(ModCallback.POST_CURSE_EVAL)
  postCurseEval(): BitFlags<LevelCurse> | undefined {
    return bitFlags(LevelCurse.NONE);
  }
}
