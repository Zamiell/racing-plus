import { getScreenBottomRightPos } from "isaacscript-common";
import g from "../../globals";

const NOTIFICATION_LENGTH = 300;
const NOTIFICATION_TEXT =
  "Subscribe to Mod Config Menu to enable custom hotkeys for Racing+";

let displayedNotification = false;
let timer: int | null = null;

// ModCallbacks.MC_POST_RENDER (2)
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

  const isPaused = g.g.IsPaused();
  if (isPaused) {
    return;
  }

  const bottomRightPos = getScreenBottomRightPos();
  const closeToBottom = bottomRightPos.Y - 28;
  const alpha = (math.min(timer, 60) / 60) * 0.5;
  const color = KColor(1, 1, 0, alpha);
  g.fontPF.DrawString(
    NOTIFICATION_TEXT,
    0,
    closeToBottom,
    color,
    bottomRightPos.X,
    true,
  );
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (displayedNotification) {
    return;
  }

  displayedNotification = true;
  timer = NOTIFICATION_LENGTH;
}
