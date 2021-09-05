// Automatically open the Mega Satan door on races with a Mega Satan goal

import g from "../../globals";
import RaceGoal from "./types/RaceGoal";
import RacerStatus from "./types/RacerStatus";
import RaceStatus from "./types/RaceStatus";

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
    g.sfx.Stop(SoundEffect.SOUND_UNLOCK00);
  }
}
