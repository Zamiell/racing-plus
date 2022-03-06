import { ISAAC_FRAMES_PER_SECOND } from "isaacscript-common";
import * as timer from "../../timer";
import { TimerType } from "../../types/TimerType";
import { shouldDrawRaceTimer } from "../race/raceTimer";
import v from "./v";

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  // The speedrun timer is superfluous if we are doing a race, since the race timer will be shown on
  // the screen
  if (shouldDrawRaceTimer()) {
    return;
  }

  drawSpeedrunTimer();
}

function drawSpeedrunTimer() {
  const isaacFrameCount = Isaac.GetFrameCount();

  // Find out how much time has passed since the speedrun started
  let elapsedFrames: int;
  if (v.run.finished && v.run.finishedFrames !== null) {
    elapsedFrames = v.run.finishedFrames;
  } else if (v.persistent.startedFrame === null) {
    elapsedFrames = 0;
  } else {
    elapsedFrames = isaacFrameCount - v.persistent.startedFrame;
  }
  const seconds = elapsedFrames / ISAAC_FRAMES_PER_SECOND;

  timer.draw(TimerType.RACE_OR_SPEEDRUN, seconds);
}
