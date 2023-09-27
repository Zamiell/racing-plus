import { validateCustomEnum } from "isaacscript-common";

export const SoundEffectCustom = {
  SPEEDRUN_FINISH: Isaac.GetSoundIdByName("Speedrun Finish"),
} as const;

validateCustomEnum("SoundEffectCustom", SoundEffectCustom);
