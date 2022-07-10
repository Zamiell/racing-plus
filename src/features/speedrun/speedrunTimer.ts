import { RENDER_FRAMES_PER_SECOND } from "isaacscript-common";
import { TimerType } from "../../enums/TimerType";
import * as timer from "../../timer";
import { shouldDrawRaceTimer } from "../race/raceTimer";
import v from "./v";

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  // The speedrun timer is superfluous if we are doing a race, since the race timer will be shown on
  // the screen.
  if (shouldDrawRaceTimer()) {
    return;
  }

  drawSpeedrunTimer();
}

function drawSpeedrunTimer() {
  const renderFrameCount = Isaac.GetFrameCount();

  // Find out how much time has passed since the speedrun started.
  let elapsedFrames: int;
  if (v.run.finished && v.run.finishedFrames !== null) {
    elapsedFrames = v.run.finishedFrames;
  } else if (v.persistent.startedSpeedrunFrame === null) {
    elapsedFrames = 0;
  } else {
    elapsedFrames = renderFrameCount - v.persistent.startedSpeedrunFrame;
  }
  const seconds = elapsedFrames / RENDER_FRAMES_PER_SECOND;

  timer.draw(TimerType.RACE_OR_SPEEDRUN, seconds);
}
