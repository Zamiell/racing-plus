import { Keyboard, ModCallback } from "isaac-typescript-definitions";
import { Callback, isKeyboardPressed } from "isaacscript-common";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

/** In milliseconds. */
let timeConsoleOpenedOrUsed: int | undefined;

export class TimeConsoleUsed extends MandatoryModFeature {
  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (isKeyboardPressed(Keyboard.GRAVE_ACCENT)) {
      timeConsoleOpenedOrUsed = Isaac.GetTime();
    }
  }

  // 22
  @Callback(ModCallback.EXECUTE_CMD)
  executeCmd(): void {
    // Record the time of the last command.
    timeConsoleOpenedOrUsed = Isaac.GetTime();
  }
}

/** In milliseconds. */
export function getTimeConsoleUsed(): int | undefined {
  return timeConsoleOpenedOrUsed;
}
