import { isKeyboardPressed } from "isaacscript-common";
import g from "./globals";

const DEBUG_HOTKEY = Keyboard.KEY_F2;

let debugHotkeyPressed = false;

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  if (!g.debug) {
    return;
  }

  if (isKeyboardPressed(DEBUG_HOTKEY)) {
    if (!debugHotkeyPressed) {
      hotkeyFunction();
    }
    debugHotkeyPressed = true;
  } else {
    debugHotkeyPressed = false;
  }
}

function hotkeyFunction() {}

export default function debugFunction(): void {
  // Enable debug mode
  g.debug = true;
}
