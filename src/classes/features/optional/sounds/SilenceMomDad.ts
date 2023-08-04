import { SoundEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  sfxManager,
} from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const MOM_AND_DAD_SOUND_EFFECTS = [
  SoundEffect.MOM_AND_DAD_1,
  SoundEffect.MOM_AND_DAD_2,
  SoundEffect.MOM_AND_DAD_3,
  SoundEffect.MOM_AND_DAD_4,
] as const;

export class SilenceMomDad extends ConfigurableModFeature {
  configKey: keyof Config = "SilenceMomDad";

  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {
    if (!config.SilenceMomDad) {
      return;
    }

    for (const soundEffect of MOM_AND_DAD_SOUND_EFFECTS) {
      sfxManager.Stop(soundEffect);
    }
  }
}
