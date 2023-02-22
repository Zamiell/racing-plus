import { game } from "isaacscript-common";
import { config } from "../../../../../modConfigMenu";
import { finishGoingToNewFloor } from "../setNewState";
import { v } from "../v";

export function fastTravelPostUpdate(): void {
  if (!config.FastTravel) {
    return;
  }

  if (v.level.resumeGameFrame === null) {
    return;
  }

  const gameFrameCount = game.GetFrameCount();
  if (gameFrameCount >= v.level.resumeGameFrame) {
    v.level.resumeGameFrame = null;
    finishGoingToNewFloor();
  }
}
