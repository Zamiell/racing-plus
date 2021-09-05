// Automatically open Repentance doors in races to Mother

import { getDoors } from "isaacscript-common";
import g from "../../globals";
import RaceGoal from "./types/RaceGoal";
import RacerStatus from "./types/RacerStatus";
import RaceStatus from "./types/RaceStatus";

export function preSpawnClearAward(): void {
  openRepentanceDoor();
}

function openRepentanceDoor() {
  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING ||
    g.race.goal !== RaceGoal.MOTHER
  ) {
    return;
  }

  const player = Isaac.GetPlayer();
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();

  if (roomType === RoomType.ROOM_BOSS && roomClear) {
    for (const door of getDoors()) {
      if (door.IsLocked()) {
        door.TryUnlock(player, true);
      }
    }
  }
}
