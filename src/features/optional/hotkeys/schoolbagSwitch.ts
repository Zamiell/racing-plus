import { getPlayers, isKeyboardPressed } from "isaacscript-common";
import { hotkeys } from "../../../modConfigMenu";

let isPressed = false;

export function postUpdate(): void {
  // See the comment in the "fastDrop.ts" file about reading keyboard inputs
  checkInput();
}

function checkInput() {
  if (hotkeys.schoolbagSwitch === -1) {
    return;
  }

  if (!isKeyboardPressed(hotkeys.schoolbagSwitch)) {
    isPressed = false;
    return;
  }

  if (isPressed) {
    return;
  }
  isPressed = true;

  schoolbagSwitch();
}

function schoolbagSwitch() {
  for (const player of getPlayers()) {
    player.SwapActiveItems(); // This will be a no-op if they do not have the Schoolbag
  }
}
