import { getPlayers, setHotkey } from "isaacscript-common";
import { hotkeys } from "../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../utils";

export function init(): void {
  // See the comment in the "fastDrop.ts" file about reading keyboard inputs.
  const keyboardFunc = () =>
    hotkeys.schoolbagSwitch === -1 ? undefined : hotkeys.schoolbagSwitch;
  // eslint-disable-next-line isaacscript/strict-enums
  setHotkey(keyboardFunc, schoolbagSwitch);
}

function schoolbagSwitch() {
  if (!shouldCheckForGameplayInputs()) {
    return;
  }

  for (const player of getPlayers()) {
    player.SwapActiveItems(); // This will be a no-op if they do not have the Schoolbag.
  }
}
