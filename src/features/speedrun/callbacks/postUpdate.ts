import { inSpeedrun } from "../speedrun";
import v from "../v";

export default function speedrunPostUpdate(): void {
  checkStartTimer();
}

function checkStartTimer() {
  if (!inSpeedrun()) {
    return;
  }

  if (v.persistent.startedFrame !== null) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();

  // We want to start the timer on the first game frame
  // (as opposed to when the screen is fading in)
  // Thus, we must check for this on every frame
  // This is to keep the timing consistent with historical timing of speedruns
  v.persistent.startedFrame = isaacFrameCount;
  v.persistent.startedCharFrame = isaacFrameCount;
}
