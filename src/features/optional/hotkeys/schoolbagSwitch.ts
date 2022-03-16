import { getPlayers, isKeyboardPressed } from "isaacscript-common";
import { hotkeys } from "../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../utilsGlobals";

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
  if (!shouldCheckForGameplayInputs()) {
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
