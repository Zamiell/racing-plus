// Automatically open the Mega Satan door on races with a Mega Satan goal

import { DoorSlot, SoundEffect } from "isaac-typescript-definitions";
import { sfxManager } from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const stage = g.l.GetStage();
  const player = Isaac.GetPlayer();

  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING ||
    g.race.goal !== RaceGoal.MEGA_SATAN ||
    stage !== 11
  ) {
    return;
  }

  const topDoor = g.r.GetDoor(DoorSlot.UP_0);
  if (topDoor !== undefined) {
    topDoor.TryUnlock(player, true);
    sfxManager.Stop(SoundEffect.UNLOCK);
  }
}
