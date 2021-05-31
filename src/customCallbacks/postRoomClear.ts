import * as fastClearPostClearRoom from "../features/optional/major/fastClear/callbacks/postRoomClear";
import * as fastTravelPostClearRoom from "../features/optional/major/fastTravel/callbacks/postRoomClear";
import g from "../globals";
import { log } from "../misc";

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
  const gameFrameCount = g.g.GetFrameCount();
  log(`Room clear detected on frame: ${gameFrameCount}`);

  fastClearPostClearRoom.main();
  fastTravelPostClearRoom.main();
}
