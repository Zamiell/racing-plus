// Racing+ removes the font that displays the in-game time. Thus, we need to create a substitute for
// this. By holding the map button, players can show a timer that represents the current time spent
// on this specific run. Unlike the normal run timer, this uses real time instead of game frame
// count.

import { ButtonAction, PlayerType } from "isaac-typescript-definitions";
import {
  anyPlayerIs,
  game,
  GAME_FRAMES_PER_SECOND,
  isActionPressedOnAnyInput,
} from "isaacscript-common";
import { TimerType } from "../../enums/TimerType";
import * as timer from "../../timer";
import { getNumIdentifiedPills } from "../optional/quality/showPills";

const RUN_TIMER_X = 52;
const RUN_TIMER_Y = 64; // Aligned with the key count.
const RUN_TIMER_Y_TAINTED_ISAAC_MOD = 18;

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  checkDraw();
}

function checkDraw() {
  const hud = game.GetHUD();

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
  const gameFrameCount = game.GetFrameCount();
  const elapsedSeconds = gameFrameCount / GAME_FRAMES_PER_SECOND;

  const x = RUN_TIMER_X;
  let y = RUN_TIMER_Y;
  if (anyPlayerIs(PlayerType.ISAAC_B)) {
    y += RUN_TIMER_Y_TAINTED_ISAAC_MOD;
  }

  timer.draw(TimerType.RUN_REAL_TIME, elapsedSeconds, x, y);
}
