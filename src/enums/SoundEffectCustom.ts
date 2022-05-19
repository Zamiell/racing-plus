import { validateCustomEnum } from "isaacscript-common";

export const SoundEffectCustom = {
  SOUND_SPEEDRUN_FINISH: Isaac.GetSoundIdByName("Speedrun Finish"),
} as const;

validateCustomEnum("SoundEffectCustom", SoundEffectCustom);
