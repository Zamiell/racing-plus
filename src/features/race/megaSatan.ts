// Automatically open the Mega Satan door on races with a Mega Satan goal

import { sfxManager } from "isaacscript-common";
import g from "../../globals";
import { RaceGoal } from "./types/RaceGoal";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";

// ModCallbacks.MC_POST_NEW_LEVEL (18)
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

  const topDoor = g.r.GetDoor(DoorSlot.UP0);
  if (topDoor !== undefined) {
    topDoor.TryUnlock(player, true);
    sfxManager.Stop(SoundEffect.SOUND_UNLOCK00);
  }
}
