// Automatically open the Hush door to speed things up.

import {
  DoorSlot,
  LevelStage,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  sfxManager,
} from "isaacscript-common";
import { g } from "../../../../globals";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class OpenHushDoor extends ConfigurableModFeature {
  configKey: keyof Config = "OpenHushDoor";

  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevel(): void {
    const stage = g.l.GetStage();
    const player = Isaac.GetPlayer();

    if (stage === LevelStage.BLUE_WOMB) {
      const hushDoor = g.r.GetDoor(DoorSlot.UP_0);
      if (hushDoor !== undefined) {
        hushDoor.TryUnlock(player, true);
      }
      sfxManager.Stop(SoundEffect.BOSS_LITE_ROAR);
    }
  }
}
