import { isKeyboardPressed } from "isaacscript-common";

let timeConsoleOpenedOrUsed: int | null = null;

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (isKeyboardPressed(Keyboard.KEY_GRAVE_ACCENT)) {
    timeConsoleOpenedOrUsed = Isaac.GetTime();
  }
}

// ModCallbacks.MC_EXECUTE_CMD (22)
export function executeCmd(): void {
  // Record the time of the last command
  timeConsoleOpenedOrUsed = Isaac.GetTime();
}

export function getTimeConsoleUsed(): int | null {
  return timeConsoleOpenedOrUsed;
}
