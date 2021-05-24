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
  fastClearClearRoom.setDeferClearForGhost(false);
}
