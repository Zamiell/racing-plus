// Automatically open Antibirth doors in races to Mother

import { getDoors } from "isaacscript-common";
import g from "../../globals";

export function postRoomClear(): void {
  openAntibirthDoor();
}

function openAntibirthDoor() {
  if (
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing" ||
    g.race.goal !== "Mother"
  ) {
    return;
  }

  const player = Isaac.GetPlayer();
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();

  if (roomType === RoomType.ROOM_BOSS && roomClear) {
    for (const door of getDoors()) {
      if (door !== null && door.IsLocked()) {
        door.TryUnlock(player, true);
      }
    }
  }
}
