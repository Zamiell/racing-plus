import { Keyboard } from "isaac-typescript-definitions";
import { isKeyboardPressed } from "isaacscript-common";

let timeConsoleOpenedOrUsed: int | null = null;

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (isKeyboardPressed(Keyboard.GRAVE_ACCENT)) {
    timeConsoleOpenedOrUsed = Isaac.GetTime();
  }
}

// ModCallback.EXECUTE_CMD (22)
export function executeCmd(): void {
  // Record the time of the last command.
  timeConsoleOpenedOrUsed = Isaac.GetTime();
}

export function getTimeConsoleUsed(): int | null {
  return timeConsoleOpenedOrUsed;
}
