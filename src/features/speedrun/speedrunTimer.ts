import { ISAAC_FRAMES_PER_SECOND } from "../../constants";
import g from "../../globals";
import * as timer from "../../timer";
import TimerType from "../../types/TimerType";
import v from "./v";

export function postRender(): void {
  checkDisplay();
}

function checkDisplay() {
  const isaacFrameCount = Isaac.GetFrameCount();

  if (g.seeds.HasSeedEffect(SeedEffect.SEED_NO_HUD)) {
    return;
  }

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

  timer.display(TimerType.RaceOrSpeedrun, seconds);
}
