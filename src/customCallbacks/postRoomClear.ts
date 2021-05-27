import * as fastClearPostClearRoom from "../features/optional/major/fastClear/callbacks/postRoomClear";
import * as fastTravelPostClearRoom from "../features/optional/major/fastTravel/callbacks/postRoomClear";
import g from "../globals";
import { log } from "../misc";

export function postUpdate(): void {
  const clear = g.r.IsClear();
  if (clear !== g.run.room.clear) {
    g.run.room.clear = clear;
    roomClear();
  }
}

function roomClear() {
  const gameFrameCount = g.g.GetFrameCount();
  log(`Room clear detected on frame: ${gameFrameCount}`);

  fastClearPostClearRoom.main();
  fastTravelPostClearRoom.main();
}
