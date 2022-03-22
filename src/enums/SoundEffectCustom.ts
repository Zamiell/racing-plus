import { validateCustomEnum } from "isaacscript-common";

export enum SoundEffectCustom {
  SOUND_SPEEDRUN_FINISH = Isaac.GetSoundIdByName("Speedrun Finish"),
}

validateCustomEnum("SoundEffectCustom", SoundEffectCustom);
