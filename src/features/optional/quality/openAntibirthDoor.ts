// Automatically open Antibirth doors in races to Mother

import g from "../../../globals";
import { getAllDoors } from "../../../misc";

export function main(): void {
  if (
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing" ||
    g.race.goal !== "Mother"
  ) {
    return;
  }

  const player = Isaac.GetPlayer();
  if (g.r.GetType() === RoomType.ROOM_BOSS && g.r.IsClear()) {
    for (const door of getAllDoors()) {
      if (door !== null && door.IsLocked()) {
        door.TryUnlock(player, true);
      }
    }
  }
}
