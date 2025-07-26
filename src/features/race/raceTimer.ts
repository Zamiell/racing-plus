import { RacerStatus } from "../../enums/RacerStatus";
import { TimerType } from "../../enums/TimerType";
import { g } from "../../globals";
import { timerDraw } from "../../timer";
import { inRaceRoom } from "./raceRoom";

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (shouldDrawRaceTimer()) {
    drawRaceTimer();
  }
}

function drawRaceTimer() {
  // Find out how much time has passed since the race started.
  const elapsedTimeMilliseconds = g.raceVars.finished
    ? g.raceVars.finishedTime
    : Isaac.GetTime() - g.raceVars.startedTime;
  const seconds = elapsedTimeMilliseconds / 1000;

  timerDraw(TimerType.RACE_OR_SPEEDRUN, seconds);
}

export function shouldDrawRaceTimer(): boolean {
  if (
    g.race.myStatus !== RacerStatus.RACING
    && g.race.myStatus !== RacerStatus.FINISHED
  ) {
    return false;
  }

  if (g.race.myStatus === RacerStatus.FINISHED && !g.raceVars.finished) {
    // We booted the game after a race was finished.
    return false;
  }

  // Prevent the timer from flashing for a brief second before the game resets.
  if (inRaceRoom()) {
    return false;
  }

  return true;
}
