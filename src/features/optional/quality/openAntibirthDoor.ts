// Automatically open Antibirth doors in races to Mother

import g from "../../../globals";
import { getAllDoors } from "../../../misc";

export function main(): void {
  const player = Isaac.GetPlayer();
  if (g.r.GetType() === RoomType.ROOM_BOSS && g.r.IsClear()) {
    for (const door of getAllDoors()) {
      if (door !== null && door.IsLocked()) {
        door.TryUnlock(player, true);
      }
    }
  }
}
