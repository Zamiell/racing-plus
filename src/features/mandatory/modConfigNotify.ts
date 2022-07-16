import { fonts, game, getScreenBottomRightPos } from "isaacscript-common";

const NOTIFICATION_LENGTH = 300;
const NOTIFICATION_TEXT =
  "Subscribe to Mod Config Menu to enable custom hotkeys for Racing+";

let displayedNotification = false;
let timer: int | null = null;

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (ModConfigMenu !== undefined) {
    return;
  }

  if (timer === null) {
    return;
  }

  timer -= 1;
  if (timer === 0) {
    timer = null;
    return;
  }

  const hud = game.GetHUD();
  if (!hud.IsVisible()) {
    return;
  }

  // We do not have to check to see if the game is paused because the text will not be drawn on top
  // of the pause menu.

  const bottomRightPos = getScreenBottomRightPos();
  const closeToBottom = bottomRightPos.Y - 28;
  const alpha = (math.min(timer, 60) / 60) * 0.5;
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

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (displayedNotification) {
    return;
  }

  displayedNotification = true;
  timer = NOTIFICATION_LENGTH;
}
