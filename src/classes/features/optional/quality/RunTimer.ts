// Racing+ removes the font that displays the in-game time. Thus, we need to create a substitute for
// this. By holding the map button, players can show a timer that represents the current time spent
// on this specific run. Unlike the normal run timer, this uses real time instead of game frame
// count.

import { ButtonAction, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  GAME_FRAMES_PER_SECOND,
  isActionPressedOnAnyInput,
  VectorZero,
} from "isaacscript-common";
import { TimerType } from "../../../../enums/TimerType";
import { getNumIdentifiedPills } from "../../../../features/optional/quality/showPills";
import * as timer from "../../../../timer";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import { ANOTHER_UI_ICON_OFFSET } from "../../major/FreeDevilItem";
import {
  getTopLeftUIPositionShowMaxFamiliars,
  hasMaxFamiliars,
} from "./ShowMaxFamiliars";

const OFFSET_FROM_WHERE_AN_ICON_WOULD_BE = Vector(14, -10);

export class RunTimer extends ConfigurableModFeature {
  configKey: keyof Config = "RunTimer";

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (this.shouldDraw()) {
      this.draw();
    }
  }

  shouldDraw(): boolean {
    const hud = game.GetHUD();

    return (
      hud.IsVisible() &&
      isActionPressedOnAnyInput(ButtonAction.MAP) &&
      // Don't show it if we have identified a lot of pills, since it will overlap with the pill UI.
      getNumIdentifiedPills() < 11
    );
  }

  draw(): void {
    // Find out how much time has passed since the run started.
    const gameFrameCount = game.GetFrameCount();
    const elapsedSeconds = gameFrameCount / GAME_FRAMES_PER_SECOND;
    const position = getTopLeftUIPositionRunTimer();
    timer.draw(TimerType.RUN_REAL_TIME, elapsedSeconds, position.X, position.Y);
  }
}

function getTopLeftUIPositionRunTimer() {
  const topLeftUIPosition = getTopLeftUIPositionShowMaxFamiliars();
  const maxFamiliarsOffset = hasMaxFamiliars()
    ? ANOTHER_UI_ICON_OFFSET
    : VectorZero;

  return topLeftUIPosition
    .add(maxFamiliarsOffset)
    .add(OFFSET_FROM_WHERE_AN_ICON_WOULD_BE);
}
