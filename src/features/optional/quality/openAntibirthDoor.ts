// Automatically open Antibirth doors in races to Mother

import g from "../../../globals";

export function main(): void {
  const player = Isaac.GetPlayer();
  if (g.r.GetType() === RoomType.ROOM_BOSS && g.r.IsClear()) {
    for (let i = 0; i < 8; i++) {
      const Door = g.r.GetDoor(i);
      if (Door !== null && Door.IsLocked()) {
        Door.TryUnlock(player, true);
      }
    }
  }
}
