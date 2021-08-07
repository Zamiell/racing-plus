// Automatically open the Mega Satan door on races with a Mega Satan goal

import g from "../../globals";

export function postNewLevel(): void {
  const stage = g.l.GetStage();
  const player = Isaac.GetPlayer();

  if (
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing" ||
    g.race.goal !== "Mega Satan" ||
    stage !== 11
  ) {
    return;
  }

  const topDoor = g.r.GetDoor(DoorSlot.UP0);
  if (topDoor !== null) {
    topDoor.TryUnlock(player, true);
    g.sfx.Stop(SoundEffect.SOUND_UNLOCK00);
  }
}
