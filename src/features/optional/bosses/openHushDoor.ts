// Automatically open the Hush door to speed things up.

import {
  DoorSlot,
  LevelStage,
  SoundEffect,
} from "isaac-typescript-definitions";
import { sfxManager } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  if (!config.openHushDoor) {
    return;
  }

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
