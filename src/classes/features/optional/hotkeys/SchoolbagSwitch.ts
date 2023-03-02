import { getPlayers } from "isaacscript-common";
import { mod } from "../../../../mod";
import { hotkeys } from "../../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../../utils";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

export class SchoolbagSwitch extends MandatoryModFeature {
  constructor() {
    super();

    // See the comment in the "FastDrop.ts" file about reading keyboard inputs.
    const keyboardFunc = () =>
      hotkeys.schoolbagSwitch === -1 ? undefined : hotkeys.schoolbagSwitch;
    mod.setConditionalHotkey(keyboardFunc, schoolbagSwitchHotkeyPressed);
  }
}

function schoolbagSwitchHotkeyPressed() {
  if (!shouldCheckForGameplayInputs()) {
    return;
  }

  for (const player of getPlayers()) {
    player.SwapActiveItems(); // This will be a no-op if they do not have the Schoolbag.
  }
}
