import g from "../../globals";
import * as timer from "../../timer";
import { TimerType } from "../../types/TimerType";
import { inRaceRoom } from "./raceRoom";
import { RacerStatus } from "./types/RacerStatus";

export function postRender(): void {
  checkDisplay();
}

function checkDisplay() {
  if (
    g.race.myStatus !== RacerStatus.RACING &&
    g.race.myStatus !== RacerStatus.FINISHED
  ) {
    return;
  }

  if (g.race.myStatus === RacerStatus.FINISHED && !g.raceVars.finished) {
    // We booted the game after a race was finished
    return;
  }

  // Prevent the timer from flashing for a brief second before the game resets
  if (inRaceRoom()) {
    return;
  }

  // Find out how much time has passed since the race started
  let elapsedTime: float;
  if (g.raceVars.finished) {
    elapsedTime = g.raceVars.finishedTime;
  } else {
    elapsedTime = Isaac.GetTime() - g.raceVars.startedTime;
  }
  const seconds = elapsedTime / 1000; // elapsedTime is in milliseconds

  timer.display(TimerType.RACE_OR_SPEEDRUN, seconds);
}
