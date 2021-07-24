import g from "../../../globals";
import openAntibirthDoor from "../openAntibirthDoor";

export function postUpdate(): void {
  const gameFrameCount = g.g.GetFrameCount();
  const isClear = g.r.IsClear();

  if (isClear !== g.run.room.clear) {
    g.run.room.clear = isClear;
    g.run.room.clearFrame = gameFrameCount;
    roomClear();
  }
}

function roomClear() {
  openAntibirthDoor();
}
