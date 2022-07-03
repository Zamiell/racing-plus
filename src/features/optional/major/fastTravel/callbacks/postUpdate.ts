import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import { finishGoingToNewFloor } from "../setNewState";
import v from "../v";

export function fastTravelPostUpdate(): void {
  if (!config.fastTravel) {
    return;
  }

  if (v.level.resumeGameFrame === null) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  if (gameFrameCount >= v.level.resumeGameFrame) {
    v.level.resumeGameFrame = null;
    finishGoingToNewFloor();
  }
}
