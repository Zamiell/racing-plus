import { getPlayers, isKeyboardPressed } from "isaacscript-common";
import g from "../../../globals";
import { hotkeys } from "../../../modConfigMenu";

let isPressed = false;

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (hotkeys.schoolbagSwitch === -1) {
    return;
  }

  // See the comment in the "fastDrop.ts" file about reading keyboard inputs
  checkInput();
}

function checkInput() {
  const isPaused = g.g.IsPaused();

  // Don't check for inputs when the game is paused or the console is open
  if (isPaused) {
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
