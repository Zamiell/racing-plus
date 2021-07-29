// Racing+ removes the font that displays the in-game time
// Thus, we need to create a substitute for this
// By holding the map button, players can show a timer that represents the current time spent on
// this specific run
// Unlike the normal run timer, this uses real time instead of game frame count

import { anyPlayerIs, isActionPressedOnAnyInput } from "isaacscript-common";
import g from "../../globals";
import * as timer from "../../timer";
import TimerType from "../../types/TimerType";

const RUN_TIMER_X = 52;
const RUN_TIMER_Y = 49;
const RUN_TIMER_Y_TAINTED_ISAAC_MOD = 18;

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  checkStartTimer();
}

function checkStartTimer() {
  if (g.run.startedTime === 0) {
    g.run.startedTime = Isaac.GetTime();
  }
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  checkDisplay();
}

function checkDisplay() {
  if (!isActionPressedOnAnyInput(ButtonAction.ACTION_MAP)) {
    return;
  }

  if (g.seeds.HasSeedEffect(SeedEffect.SEED_NO_HUD)) {
    return;
  }

  // Don't show it if we have identified a lot of pills, since it will overlap with the pill UI
  if (g.run.pills.length >= 11) {
    return;
  }

  // Find out how much time has passed since the run started
  let elapsedTime: float;
  if (g.run.startedTime === 0) {
    // We are currently fading in at the beginning of a run
    elapsedTime = 0;
  } else {
    elapsedTime = Isaac.GetTime() - g.run.startedTime;
  }
  const seconds = elapsedTime / 1000; // elapsedTime is in milliseconds

  const x = RUN_TIMER_X;
  let y = RUN_TIMER_Y;
  if (anyPlayerIs(PlayerType.PLAYER_ISAAC_B)) {
    y += RUN_TIMER_Y_TAINTED_ISAAC_MOD;
  }

  timer.display(TimerType.RunRealTime, seconds, x, y);
}
