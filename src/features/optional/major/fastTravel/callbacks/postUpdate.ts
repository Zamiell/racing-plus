import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import { FastTravelState } from "../enums";
import * as nextFloor from "../nextFloor";
import { setNewState } from "../setNewState";
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
    resumeFastTravel();
  }
}

/**
 * In some situations, we manually interrupt fast-travel before going to the next floor. This allows
 * other features to resume fast-travel.
 *
 * The logic here is copied from the "setGoingToNewFloor()" function.
 */
function resumeFastTravel() {
  nextFloor.goto(v.run.upwards);
  setNewState(FastTravelState.FADING_IN);
}
