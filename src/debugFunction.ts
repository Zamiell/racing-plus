import {
  isKeyboardPressed,
  log,
  printConsole,
  saveDataManager,
  saveDataManagerSetGlobal,
  setLogFunctionsGlobal,
} from "isaacscript-common";
import g from "./globals";
import { hotkeys } from "./modConfigMenu";

const DEBUG_HOTKEY_1 = Keyboard.KEY_F2;
const DEBUG_HOTKEY_2 = Keyboard.KEY_F3;

let debugHotkey1Pressed = false;
let debugHotkey2Pressed = false;

const v = {
  run: {
    debug,
  },
};

export function init(): void {
  saveDataManager("debugFunction", v, () => false);
}

function debugCode() {
  // Add code here
}

export function debugFunction(): void {
  g.debug = true;
  saveDataManagerSetGlobal();
  setLogFunctionsGlobal();

  log("Entering debug function.");
  debugCode();
  log("Exiting debug function.");
}

// ModCallbacks.MC_POST_UPDATE (1)
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

function hotkey1Function() {
  debugCode();
}

function hotkey2Function() {
  hotkeys.fastDropAll = Keyboard.KEY_Z;
  hotkeys.autofire = Keyboard.KEY_F;
  hotkeys.roll = Keyboard.KEY_G;

  printConsole("Test hotkeys set.");
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {}
