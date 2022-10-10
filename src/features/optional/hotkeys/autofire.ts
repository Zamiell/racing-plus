// We have to return a value from both the `isActionPressed` and the `getActionValue` callbacks in
// order for Anti-Gravity autofire to work.

import { CollectibleType } from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { mod } from "../../../mod";
import { hotkeys } from "../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../utils";
import { setStreakText } from "../../mandatory/streakText";

/** Release the key on every other frame. */
const NORMAL_FRAME_DELAY = 2;

/** From trial and error, this is roughly equivalent to what I can spam manually. */
const SPIRIT_SWORD_FRAME_DELAY = 3;

const v = {
  run: {
    enabled: false,
  },
};

export function init(): void {
  mod.saveDataManager("autofire", v, featureEnabled);

  // See the comment in the "fastDrop.ts" file about reading keyboard inputs.
  const keyboardFunc = () =>
    hotkeys.autofire === -1 ? undefined : hotkeys.autofire;
  mod.setConditionalHotkey(keyboardFunc, toggleAutofire);
}

function featureEnabled() {
  return hotkeys.autofire !== -1;
}

function toggleAutofire() {
  if (!shouldCheckForGameplayInputs()) {
    return;
  }

  v.run.enabled = !v.run.enabled;
  const enabledText = v.run.enabled ? "Enabled" : "Disabled";
  setStreakText(`${enabledText} autofire.`);
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
