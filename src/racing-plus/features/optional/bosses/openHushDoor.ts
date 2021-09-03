// Automatically open the Hush door to speed things up

import g from "../../../globals";
import { config } from "../../../modConfigMenu";

export function postNewLevel(): void {
  if (!config.openHushDoor) {
    return;
  }

  const stage = g.l.GetStage();
  const player = Isaac.GetPlayer();

  if (stage === 9) {
    const hushDoor = g.r.GetDoor(DoorSlot.UP0);
    if (hushDoor !== null) {
      hushDoor.TryUnlock(player, true);
    }
    g.sfx.Stop(SoundEffect.SOUND_BOSS_LITE_ROAR);
  }
}
