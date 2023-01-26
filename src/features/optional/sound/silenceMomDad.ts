import { SoundEffect } from "isaac-typescript-definitions";
import { sfxManager } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const MOM_AND_DAD_SOUND_EFFECTS: ReadonlySet<SoundEffect> = new Set([
  SoundEffect.MOM_AND_DAD_1,
  SoundEffect.MOM_AND_DAD_2,
  SoundEffect.MOM_AND_DAD_3,
  SoundEffect.MOM_AND_DAD_4,
]);

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  if (!config.silenceMomDad) {
    return;
  }

  for (const soundEffect of MOM_AND_DAD_SOUND_EFFECTS) {
    sfxManager.Stop(soundEffect);
  }
}
