import g from "../../../../globals";

export function setMinimapVisible(visible: boolean): void {
  if (MinimapAPI === undefined) {
    const hud = g.g.GetHUD();
    hud.SetVisible(visible);
  } else {
    MinimapAPI.Config.Disable = !visible;
  }
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
