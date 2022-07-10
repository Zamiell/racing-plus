// We have to return a value from both the `isActionPressed` and the `getActionValue` callbacks in
// order for Anti-Gravity autofire to work.

import { CollectibleType, Keyboard } from "isaac-typescript-definitions";
import { game, isKeyboardPressed, saveDataManager } from "isaacscript-common";
import { hotkeys } from "../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../utilsGlobals";
import * as streakText from "../../mandatory/streakText";

/** Release the key on every other frame. */
const NORMAL_FRAME_DELAY = 2;

/** From trial and error, this is roughly equivalent to what I can spam manually. */
const SPIRIT_SWORD_FRAME_DELAY = 3;

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

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (hotkeys.autofire === -1) {
    return;
  }

  if (!shouldCheckForGameplayInputs()) {
    return;
  }

  if (!isKeyboardPressed(hotkeys.autofire as Keyboard)) {
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

// ModCallback.INPUT_ACTION (13)
// InputHook.IS_ACTION_PRESSED (0)
// ButtonAction.SHOOT_LEFT (4)
// ButtonAction.SHOOT_RIGHT (5)
// ButtonAction.SHOOT_UP (6)
// ButtonAction.SHOOT_DOWN (7)
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

  if (autofireShouldReleaseKey(player)) {
    return false;
  }

  return undefined;
}

// ModCallback.INPUT_ACTION (13)
// InputHook.GET_ACTION_VALUE (2)
// ButtonAction.SHOOT_LEFT (4)
// ButtonAction.SHOOT_RIGHT (5)
// ButtonAction.SHOOT_UP (6)
// ButtonAction.SHOOT_DOWN (7)
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

  if (autofireShouldReleaseKey(player)) {
    return 0;
  }

  return undefined;
}

function autofireShouldReleaseKey(player: EntityPlayer) {
  const gameFrameCount = game.GetFrameCount();
  const hasSpiritSword = player.HasCollectible(CollectibleType.SPIRIT_SWORD);
  const frameDelay = hasSpiritSword
    ? SPIRIT_SWORD_FRAME_DELAY
    : NORMAL_FRAME_DELAY;

  return gameFrameCount % frameDelay === 0;
}
