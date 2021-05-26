import * as fastClearClearRoom from "../features/optional/major/fastClear/clearRoom";
import g from "../globals";

export function postUpdate(): void {
  const clear = g.r.IsClear();
  if (clear !== g.run.room.clear) {
    g.run.room.clear = clear;
    roomClear();
  }
}

function roomClear() {
  const gameFrameCount = g.g.GetFrameCount();
  Isaac.DebugString(`Room clear detected on frame: ${gameFrameCount}`);
  fastClearClearRoom.setDeferClearForGhost(false);
}
