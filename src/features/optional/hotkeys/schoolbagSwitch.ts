import { getPlayers, setConditionalHotkey } from "isaacscript-common";
import { hotkeys } from "../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../utils";

export function init(): void {
  // See the comment in the "fastDrop.ts" file about reading keyboard inputs.
  const keyboardFunc = () =>
    hotkeys.schoolbagSwitch === -1 ? undefined : hotkeys.schoolbagSwitch;
  setConditionalHotkey(keyboardFunc, schoolbagSwitch);
}

function schoolbagSwitch() {
  if (!shouldCheckForGameplayInputs()) {
    return;
  }

  for (const player of getPlayers()) {
    player.SwapActiveItems(); // This will be a no-op if they do not have the Schoolbag.
  }
}
