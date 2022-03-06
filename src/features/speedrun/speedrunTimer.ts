import { ISAAC_FRAMES_PER_SECOND } from "isaacscript-common";
import * as timer from "../../timer";
import { TimerType } from "../../types/TimerType";
import v from "./v";

export function postRender(): void {
  checkDraw();
}

function checkDraw() {
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
