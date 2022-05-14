// Racing+ removes the font that displays the in-game time. Thus, we need to create a substitute for
// this. By holding the map button, players can show a timer that represents the current time spent
// on this specific run. Unlike the normal run timer, this uses real time instead of game frame
// count.

import { ButtonAction, PlayerType } from "isaac-typescript-definitions";
import {
  anyPlayerIs,
  isActionPressedOnAnyInput,
  saveDataManager,
} from "isaacscript-common";
import { TimerType } from "../../enums/TimerType";
import g from "../../globals";
import * as timer from "../../timer";
import { getNumIdentifiedPills } from "../optional/quality/showPills";

const RUN_TIMER_X = 52;
const RUN_TIMER_Y = 49;
const RUN_TIMER_Y_TAINTED_ISAAC_MOD = 18;

const v = {
  run: {
    startedTime: null as int | null,
  },
};

export function init(): void {
  saveDataManager("runTimer", v);
}

// ModCallback.POST_UPDATE (1)
export function postUpdate(): void {
  checkStartTimer();
}

function checkStartTimer() {
  if (v.run.startedTime === null) {
    v.run.startedTime = Isaac.GetTime();
  }
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  checkDraw();
}

function checkDraw() {
  const hud = g.g.GetHUD();

  if (!hud.IsVisible()) {
    return;
  }

  if (!isActionPressedOnAnyInput(ButtonAction.MAP)) {
    return;
  }

  // Don't show it if we have identified a lot of pills, since it will overlap with the pill UI.
  if (getNumIdentifiedPills() >= 11) {
    return;
  }

  // Find out how much time has passed since the run started.
  let elapsedTimeMilliseconds: float;
  if (v.run.startedTime === null) {
    // We are currently fading in at the beginning of a run.
    elapsedTimeMilliseconds = 0;
  } else {
    elapsedTimeMilliseconds = Isaac.GetTime() - v.run.startedTime;
  }
  const seconds = elapsedTimeMilliseconds / 1000;

  const x = RUN_TIMER_X;
  let y = RUN_TIMER_Y;
  if (anyPlayerIs(PlayerType.ISAAC_B)) {
    y += RUN_TIMER_Y_TAINTED_ISAAC_MOD;
  }

  timer.draw(TimerType.RUN_REAL_TIME, seconds, x, y);
}
