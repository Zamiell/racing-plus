// TODO: redo this function to use Pre Spawn Clear award callback

import { log } from "isaacscript-common";
import fastClearPostRoomClear from "../features/optional/major/fastClear/callbacks/postRoomClear";
import fastTravelPostRoomClear from "../features/optional/major/fastTravel/callbacks/postRoomClear";
import racePostRoomClear from "../features/race/callbacks/postRoomClear";
import g from "../globals";

export function postUpdate(): void {
  const gameFrameCount = g.g.GetFrameCount();
  const isRoomClear = g.r.IsClear();

  if (isRoomClear !== g.run.room.clear) {
    g.run.room.clear = isRoomClear;
    g.run.room.clearFrame = gameFrameCount;
    roomClear();
  }
}

function roomClear() {
  const gameFrameCount = g.g.GetFrameCount();
  log(`Room clear detected on game frame: ${gameFrameCount}`);

  fastClearPostRoomClear();
  fastTravelPostRoomClear();
  racePostRoomClear();
}
