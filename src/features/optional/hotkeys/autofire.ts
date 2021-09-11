// We have to return a value from both the "isActionPressed()" and the "getActionValue()" callbacks
// in order for Anti-Gravity autofire to work

import { isKeyboardPressed, saveDataManager } from "isaacscript-common";
import g from "../../../globals";
import { hotkeys } from "../../../modConfigMenu";
import * as streakText from "../../mandatory/streakText";

const v = {
  run: {
    enabled: false,
  },
};

let isPressed = false;

export function init(): void {
  saveDataManager("autofire", v, featureEnabled);
}

function featureEnabled() {
  return hotkeys.autofire !== -1;
}

export function postUpdate(): void {
  if (hotkeys.autofire === -1) {
    return;
  }

  // See the comment in the "fastDrop.ts" file about reading keyboard inputs
  checkInput();
}

function checkInput() {
  if (!isKeyboardPressed(hotkeys.autofire)) {
    isPressed = false;
    return;
  }

  if (isPressed) {
    return;
  }
  isPressed = true;

  toggleAutofire();
}

function toggleAutofire() {
  v.run.enabled = !v.run.enabled;
  const enabledText = v.run.enabled ? "Enabled" : "Disabled";
  streakText.set(`${enabledText} autofire.`);
}

// ModCallbacks.MC_INPUT_ACTION (13)
// InputHook.IS_ACTION_PRESSED (0);
// ButtonAction.ACTION_SHOOTLEFT (4)
// ButtonAction.ACTION_SHOOTRIGHT (5)
// ButtonAction.ACTION_SHOOTUP (6)
// ButtonAction.ACTION_SHOOTDOWN (7)
export function inputActionIsActionPressedShoot(
  entity: Entity | undefined,
): boolean | undefined {
  if (!v.run.enabled) {
    return undefined;
  }

  if (entity === undefined) {
    return undefined;
  }

  const player = entity.ToPlayer();
  if (player === undefined) {
    return undefined;
  }

  if (autofireShouldReleaseKey()) {
    return false;
  }

  return undefined;
}

// ModCallbacks.MC_INPUT_ACTION (13)
// InputHook.GET_ACTION_VALUE (2)
// ButtonAction.ACTION_SHOOTLEFT (4)
// ButtonAction.ACTION_SHOOTRIGHT (5)
// ButtonAction.ACTION_SHOOTUP (6)
// ButtonAction.ACTION_SHOOTDOWN (7)
export function inputActionGetActionValueShoot(
  entity: Entity | undefined,
): float | undefined {
  if (!v.run.enabled) {
    return undefined;
  }

  if (entity === undefined) {
    return undefined;
  }

  const player = entity.ToPlayer();
  if (player === undefined) {
    return undefined;
  }

  if (autofireShouldReleaseKey()) {
    return 0;
  }

  return undefined;
}

function autofireShouldReleaseKey() {
  const gameFrameCount = g.g.GetFrameCount();
  return gameFrameCount % 2 === 0;
}
