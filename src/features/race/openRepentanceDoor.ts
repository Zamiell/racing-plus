// Automatically open Repentance doors in races to Mother

import { RoomType } from "isaac-typescript-definitions";
import { getDoors } from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";

// ModCallback.PRE_SPAWN_CLEAN_AWARD (70)
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

  if (roomType === RoomType.BOSS && roomClear) {
    for (const door of getDoors()) {
      if (door.IsLocked()) {
        door.TryUnlock(player, true);
      }
    }
  }
}
