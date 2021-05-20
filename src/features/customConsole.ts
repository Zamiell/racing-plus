// TODO:
// - add feature where you can press escape to exit, and the text will remain

import g from "../globals";
import { consoleCommand } from "../misc";

let isConsoleOpen = false;
let consoleText = "";
let consoleTextIndex = 0;
Isaac.DebugString(`${consoleTextIndex}`);
const keysPressed = new Map<Keyboard, boolean>();

export function postRender(): void {
  checkKeyboardInput();
}

function checkKeyboardInput() {
  if (g.g.IsPaused()) {
    return;
  }

  // Record the pressed state of every possible key
  for (const keyboardValue of Object.values(Keyboard)) {
    if (Input.IsButtonPressed(keyboardValue as Keyboard, g.p.ControllerIndex)) {
      keysPressed.set(keyboardValue as Keyboard, true);
    } else {
      keysPressed.delete(keyboardValue as Keyboard);
    }
  }

  if (isConsoleOpen) {
    handleInput();
  } else if (keysPressed.has(Keyboard.KEY_ENTER)) {
    open();
  }
}

function handleInput() {
  if (keysPressed.has(Keyboard.KEY_ENTER)) {
    close();
  }
}

function open() {
  isConsoleOpen = true;
  consoleText = "";
  consoleTextIndex = 0;
  Isaac.DebugString("Console opened.");
}

function close() {
  isConsoleOpen = false;

  if (consoleText !== "") {
    consoleCommand(consoleText);
  }

  Isaac.DebugString("Console closed.");
}
