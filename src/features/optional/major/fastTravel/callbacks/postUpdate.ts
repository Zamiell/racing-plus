import { game } from "isaacscript-common";
import { finishGoingToNewFloor } from "../../../../../classes/features/optional/major/fastTravel/setNewState";
import { v } from "../../../../../classes/features/optional/major/fastTravel/v";
import { config } from "../../../../../modConfigMenu";

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
