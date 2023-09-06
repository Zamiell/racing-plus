import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  fonts,
  game,
  getScreenBottomRightPos,
  ModCallbackCustom,
} from "isaacscript-common";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

const NOTIFICATION_LENGTH = 300;
const NOTIFICATION_TEXT =
  "Subscribe to Mod Config Menu to enable custom hotkeys for Racing+";

let displayedNotification = false;
let timer: int | undefined;

export class ModConfigNotify extends MandatoryModFeature {
  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (ModConfigMenu !== undefined) {
      return;
    }

    if (timer === undefined) {
      return;
    }

    timer--;
    if (timer === 0) {
      timer = undefined;
      return;
    }

    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    // We do not have to check to see if the game is paused because the text will not be drawn on
    // top of the pause menu.

    const bottomRightPos = getScreenBottomRightPos();
    const closeToBottom = bottomRightPos.Y - 28;
    const alpha = (Math.min(timer, 60) / 60) * 0.5;
    const color = KColor(1, 1, 0, alpha);
    fonts.pfTempestaSevenCondensed.DrawString(
      NOTIFICATION_TEXT,
      0,
      closeToBottom,
      color,
      bottomRightPos.X,
      true,
    );
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (displayedNotification) {
      return;
    }

    displayedNotification = true;
    timer = NOTIFICATION_LENGTH;
  }
}
