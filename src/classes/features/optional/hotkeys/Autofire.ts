import {
  ButtonAction,
  CollectibleType,
  InputHook,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  isShootAction,
  ModCallbackCustom,
} from "isaacscript-common";
import { setStreakText } from "../../../../features/mandatory/streakText";
import { mod } from "../../../../mod";
import { hotkeys } from "../../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../../utils";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

/** Release the key on every other frame. */
const NORMAL_FRAME_DELAY = 2;

/** From trial and error, this is roughly equivalent to what I can spam manually. */
const SPIRIT_SWORD_FRAME_DELAY = 3;

const v = {
  run: {
    enabled: false,
  },
};

/**
 * We have to return a value from both the `isActionPressed` and the `getActionValue` callbacks in
 * order for Anti-Gravity autofire to work.
 */
export class Autofire extends MandatoryModFeature {
  v = v;

  constructor() {
    super();

    // See the comment in the "fastDrop.ts" file about reading keyboard inputs.
    const keyboardFunc = () =>
      hotkeys.autofire === -1 ? undefined : hotkeys.autofire;
    mod.setConditionalHotkey(keyboardFunc, toggleAutofire);
  }

  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_PLAYER,
    undefined,
    undefined,
    InputHook.IS_ACTION_PRESSED,
  )
  inputActionPlayerIsActionPressed(
    player: EntityPlayer,
    _inputHook: InputHook,
    buttonAction: ButtonAction,
  ): boolean | undefined {
    if (
      v.run.enabled &&
      isShootAction(buttonAction) &&
      autofireShouldReleaseKey(player)
    ) {
      return false;
    }

    return undefined;
  }

  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_PLAYER,
    undefined,
    undefined,
    InputHook.GET_ACTION_VALUE,
  )
  inputActionPlayerGetActionValue(
    player: EntityPlayer,
    _inputHook: InputHook,
    buttonAction: ButtonAction,
  ): float | undefined {
    if (
      v.run.enabled &&
      isShootAction(buttonAction) &&
      autofireShouldReleaseKey(player)
    ) {
      return 0;
    }

    return undefined;
  }
}

function toggleAutofire() {
  if (!shouldCheckForGameplayInputs()) {
    return;
  }

  v.run.enabled = !v.run.enabled;
  const enabledText = v.run.enabled ? "Enabled" : "Disabled";
  setStreakText(`${enabledText} autofire.`);
}

function autofireShouldReleaseKey(player: EntityPlayer) {
  const gameFrameCount = game.GetFrameCount();
  const hasSpiritSword = player.HasCollectible(CollectibleType.SPIRIT_SWORD);
  const frameDelay = hasSpiritSword
    ? SPIRIT_SWORD_FRAME_DELAY
    : NORMAL_FRAME_DELAY;

  return gameFrameCount % frameDelay === 0;
}
