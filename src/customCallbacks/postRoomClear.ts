import * as fastClearClearRoom from "../features/optional/major/fastClear/clearRoom";
import g from "../globals";
import * as ghostForm from "./ghostForm";

export function postUpdate(): void {
  const clear = g.r.IsClear();
  if (clear !== g.run.room.clear) {
    g.run.room.clear = clear;
    roomClear();
  }
}

function roomClear() {
  ghostForm.ghostFormOff();
  fastClearClearRoom.setDeferClearForGhost(false);
}
