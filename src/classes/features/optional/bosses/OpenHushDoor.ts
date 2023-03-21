// Automatically open the Hush door to speed things up.

import {
  DoorSlot,
  LevelStage,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  sfxManager,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class OpenHushDoor extends ConfigurableModFeature {
  configKey: keyof Config = "OpenHushDoor";

  @CallbackCustom(
    ModCallbackCustom.POST_NEW_LEVEL_REORDERED,
    LevelStage.BLUE_WOMB,
  )
  postNewLevelReorderedBlueWomb(): void {
    const room = game.GetRoom();
    const player = Isaac.GetPlayer();

    const hushDoor = room.GetDoor(DoorSlot.UP_0);
    if (hushDoor !== undefined) {
      hushDoor.TryUnlock(player, true);
    }
    sfxManager.Stop(SoundEffect.BOSS_LITE_ROAR);
  }
}
