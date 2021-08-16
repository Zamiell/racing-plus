import { inSpeedrun } from "../speedrun";
import v from "../v";

export default function speedrunPostUpdate(): void {
  checkStartTimer();
}

function checkStartTimer() {
  if (!inSpeedrun()) {
    return;
  }

  if (v.persistent.startedTime === null) {
    // We want to start the timer on the first game frame
    // (as opposed to when the screen is fading in)
    // Thus, we must check for this on every frame
    // This is to keep the timing consistent with historical timing of speedruns
    v.persistent.startedTime = Isaac.GetTime();
    v.persistent.startedFrame = Isaac.GetFrameCount();
    v.persistent.startedCharTime = Isaac.GetTime();
  }
}
