import type {
  ButtonAction} from "isaac-typescript-definitions";
import {
  CollectibleType,
  InputHook,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  hasCollectible,
  isShootAction,
  isShootActionPressed,
} from "isaacscript-common";
import { mod } from "../../../../mod";
import { hotkeys } from "../../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../../utils";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import { setStreakText } from "../../mandatory/misc/StreakText";

/** Release the key on every other frame. */
const NORMAL_GAME_FRAME_DELAY = 2;

const POWERFUL_COLLECTIBLE_TYPES = [
  CollectibleType.SPIRIT_SWORD,
  CollectibleType.CHOCOLATE_MILK,
] as const;

/**
 * It is possible to manually spam at a rate of once per 3 frames, but this results in Spirit Sword
 * and Chocolate Milk becoming too powerful. Thus, we manually enforce a 5 frame delay for those
 * collectibles.
 *
 * TODO: Change from 3 to 5 in R+7 Season 5.
 */
const POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY = 10;

const v = {
  run: {
    enabled: false,
    gameFrameAutofireSequenceStarted: null as int | null,

    /**
     * Needs to tick to 4 to prevent a race condition when a shoot input is pressed towards the end
     * of a frame.
     */
    startCounter: 0,

    /**
     * We must prevent players who are not using the autofire feature from doing better than what
     * autofire can do.
     */
    lastGameFrameShotReleased: null as int | null,
    shootingOnPreviousFrame: false,
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

    // See the comment in the "FastDrop.ts" file about reading keyboard inputs.
    const keyboardFunc = () =>
      hotkeys.autofire === -1 ? undefined : hotkeys.autofire;
    mod.setConditionalHotkey(keyboardFunc, autofireHotkeyPressed);
  }

  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    this.trackShootingKeypresses();
  }

  trackShootingKeypresses(): void {
    const gameFrameCount = game.GetFrameCount();
    const player = Isaac.GetPlayer(); // We only consider the first player for simplicity.
    const shootActionPressed = isShootActionPressed(player.ControllerIndex);
    const shootOnLockout = this.shouldShootBeOnLockoutToPreventSpamming(player);

    if (
      v.run.shootingOnPreviousFrame &&
      !shootActionPressed &&
      !shootOnLockout
    ) {
      v.run.lastGameFrameShotReleased = gameFrameCount;
    }

    v.run.shootingOnPreviousFrame = shootActionPressed;
  }

  // 3, 0
  @CallbackCustom(ModCallbackCustom.INPUT_ACTION_PLAYER)
  inputActionPlayer(
    player: EntityPlayer,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ): boolean | float | undefined {
    if (
      (inputHook === InputHook.IS_ACTION_PRESSED ||
        inputHook === InputHook.GET_ACTION_VALUE) &&
      isShootAction(buttonAction)
    ) {
      return this.inputActionPlayerShootAction(player, inputHook, buttonAction);
    }

    return undefined;
  }

  inputActionPlayerShootAction(
    player: EntityPlayer,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ): boolean | float | undefined {
    // Rate limit spam when autofire is turned off. (This also applies when autofire is on to
    // prevent autofire users from manually spamming the key.)
    if (this.shouldShootBeOnLockoutToPreventSpamming(player)) {
      return inputHook === InputHook.IS_ACTION_PRESSED ? false : 0;
    }

    // Handle autofire.
    if (v.run.enabled) {
      return this.inputActionShootActionAutofire(
        player,
        inputHook,
        buttonAction,
      );
    }

    return undefined;
  }

  inputActionShootActionAutofire(
    player: EntityPlayer,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ): boolean | float | undefined {
    if (!isShootActionPressed(player.ControllerIndex)) {
      v.run.startCounter = 0;
      v.run.gameFrameAutofireSequenceStarted = null;
      return undefined;
    }

    const shouldPressKey = this.autofireShouldPressKey(player);
    if (shouldPressKey) {
      Isaac.DebugString(
        `GETTING HERE - gameFrameCount: ${game.GetFrameCount()} - shouldPressKey - ${Input.GetActionValue(
          buttonAction,
          player.ControllerIndex,
        )}`,
      );
      return inputHook === InputHook.IS_ACTION_PRESSED
        ? true
        : Input.GetActionValue(buttonAction, player.ControllerIndex);
    }

    Isaac.DebugString(
      `GETTING HERE - gameFrameCount: ${game.GetFrameCount()} - !shouldPressKey`,
    );
    return inputHook === InputHook.IS_ACTION_PRESSED ? false : 0;
  }

  autofireShouldPressKey(player: EntityPlayer): boolean {
    const gameFrameCount = game.GetFrameCount();

    // If we are not currently in an autofire sequence, this is the first frame that the player has
    // held down a shoot input.
    if (v.run.gameFrameAutofireSequenceStarted === null) {
      v.run.startCounter++;
      if (v.run.startCounter === 4) {
        v.run.startCounter = 0;
        v.run.gameFrameAutofireSequenceStarted = gameFrameCount;
      }

      return true;
    }

    // Otherwise, only press the input on the Nth frame.
    const framesPassedSinceAutofireSequenceStarted =
      gameFrameCount - v.run.gameFrameAutofireSequenceStarted;
    const hasPowerfulCollectible = hasCollectible(
      player,
      ...POWERFUL_COLLECTIBLE_TYPES,
    );
    const frameDelay = hasPowerfulCollectible
      ? POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY
      : NORMAL_GAME_FRAME_DELAY;

    return framesPassedSinceAutofireSequenceStarted % frameDelay === 0;
  }

  shouldShootBeOnLockoutToPreventSpamming(player: EntityPlayer): boolean {
    const gameFrameCount = game.GetFrameCount();
    const hasPowerfulCollectible = hasCollectible(
      player,
      ...POWERFUL_COLLECTIBLE_TYPES,
    );
    const pressedShootRecently =
      v.run.lastGameFrameShotReleased !== null &&
      gameFrameCount <
        v.run.lastGameFrameShotReleased + POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY;

    return hasPowerfulCollectible && pressedShootRecently;
  }
}

function autofireHotkeyPressed() {
  if (!shouldCheckForGameplayInputs()) {
    return;
  }

  v.run.enabled = !v.run.enabled;
  const enabledText = v.run.enabled ? "Enabled" : "Disabled";
  setStreakText(`${enabledText} autofire.`);
}
