// Automatically open Repentance doors in races to Mother.

import { RoomType } from "isaac-typescript-definitions";
import { getRepentanceDoor, isRoomInsideGrid } from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";

// ModCallback.PRE_SPAWN_CLEAR_AWARD (70)
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
  const roomInsideGrid = isRoomInsideGrid();

  if (roomType === RoomType.BOSS && roomInsideGrid && roomClear) {
    const repentanceDoor = getRepentanceDoor();
    if (repentanceDoor !== undefined) {
      if (repentanceDoor.IsLocked()) {
        repentanceDoor.TryUnlock(player, true);
      }
    }
  }
}
