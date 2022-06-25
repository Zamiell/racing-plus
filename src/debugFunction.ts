import { Keyboard } from "isaac-typescript-definitions";
import {
  isKeyboardPressed,
  log,
  saveDataManagerSetGlobal,
  setLogFunctionsGlobal,
} from "isaacscript-common";
import { debugCode, hotkey1Function, hotkey2Function } from "./debugCode";
import g from "./globals";

// F1 shows the version of Racing+.
const DEBUG_HOTKEY_1 = Keyboard.F2;
const DEBUG_HOTKEY_2 = Keyboard.F3;

let debugHotkey1Pressed = false;
let debugHotkey2Pressed = false;

export function debugFunction(params?: string): void {
  g.debug = true;
  saveDataManagerSetGlobal();
  setLogFunctionsGlobal();

  log("Entering debug function.");
  debugCode(params);
  log("Exiting debug function.");
}

// ModCallback.POST_UPDATE (1)
export function postUpdate(): void {
  checkHotkeysPressed();
}

function checkHotkeysPressed() {
  if (!g.debug) {
    return;
  }

  if (isKeyboardPressed(DEBUG_HOTKEY_1)) {
    if (!debugHotkey1Pressed) {
      hotkey1Function();
    }
    debugHotkey1Pressed = true;
  } else {
    debugHotkey1Pressed = false;
  }

  if (isKeyboardPressed(DEBUG_HOTKEY_2)) {
    if (!debugHotkey2Pressed) {
      hotkey2Function();
    }
    debugHotkey2Pressed = true;
  } else {
    debugHotkey2Pressed = false;
  }
}
