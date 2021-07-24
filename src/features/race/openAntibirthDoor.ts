// Automatically open Antibirth doors in races to Mother

import g from "../../globals";
import { getAllDoors } from "../../misc";

export default function openAntibirthDoor(): void {
  if (
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing" ||
    g.race.goal !== "Mother"
  ) {
    return;
  }

  const player = Isaac.GetPlayer();
  const roomType = g.r.GetType();
  const isRoomCleared = g.r.IsClear();

  if (roomType === RoomType.ROOM_BOSS && isRoomCleared) {
    for (const door of getAllDoors()) {
      if (door !== null && door.IsLocked()) {
        door.TryUnlock(player, true);
      }
    }
  }
}
