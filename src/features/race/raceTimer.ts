import g from "../../globals";
import * as timer from "../../timer";
import TimerType from "../../types/TimerType";

export function postRender(): void {
  checkDisplay();
}

function checkDisplay() {
  if (g.race.myStatus !== "racing" && g.race.myStatus !== "finished") {
    return;
  }

  if (g.seeds.HasSeedEffect(SeedEffect.SEED_NO_HUD)) {
    return;
  }

  if (g.race.myStatus === "finished" && !g.raceVars.finished) {
    // We booted the game after a race was finished
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
