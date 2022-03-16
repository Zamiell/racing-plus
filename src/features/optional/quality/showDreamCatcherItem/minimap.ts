import { getRooms } from "isaacscript-common";
import g from "../../../../globals";

export function getMinimapDisplayFlagsMap(): Map<int, int> {
  const displayFlags = new Map<int, int>();
  for (const roomDesc of getRooms()) {
    if (roomDesc.SafeGridIndex < 0) {
      continue;
    }

    displayFlags.set(roomDesc.SafeGridIndex, roomDesc.DisplayFlags);
  }

  return displayFlags;
}

export function restoreMinimapDisplayFlags(
  displayFlagsMap: Map<int, int>,
): void {
  for (const [roomGridIndex, displayFlags] of displayFlagsMap.entries()) {
    if (MinimapAPI === undefined) {
      const roomDesc = g.l.GetRoomByIdx(roomGridIndex);
      roomDesc.DisplayFlags = displayFlags;
    } else {
      const roomDesc = MinimapAPI.GetRoomByIdx(roomGridIndex);
      if (roomDesc !== undefined) {
        roomDesc.DisplayFlags = displayFlags;
      }
    }
  }

  g.l.UpdateVisibility();
}
