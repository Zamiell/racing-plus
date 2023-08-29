import type { ButtonAction } from "isaac-typescript-definitions";
import {
  CollectibleType,
  InputHook,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  DefaultMap,
  ModCallbackCustom,
  game,
  getLastElement,
  getShootActions,
  hasCollectible,
  isShootAction,
} from "isaacscript-common";
import { mod } from "../../../../mod";
import { hotkeys } from "../../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../../utils";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import { setStreakText } from "../../mandatory/misc/StreakText";

/** Release the key on every other frame for e.g. Anti-Gravity. */
const NORMAL_GAME_FRAME_DELAY = 2;

/**
 * It is possible to manually spam at a rate of once per 3 frames, but this results in Spirit Sword
 * and Chocolate Milk becoming too powerful. Thus, we manually enforce a 5 frame delay for those
 * collectibles.
 *
 * TODO: Change from 3 to 5 in R+7 Season 5.
 */
const POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY = 5;

const POWERFUL_COLLECTIBLE_TYPES = [
  CollectibleType.SPIRIT_SWORD,
  CollectibleType.CHOCOLATE_MILK,
] as const;

const v = {
  run: {
    enabled: false,

    /**
     * A tuple of game frame and the corresponding button action. We must track the specific shoot
     * action pressed so that we can be more lenient on the with lockout code.
     */
    autofireSequenceStarted: null as [int, ButtonAction] | null,

    /**
     * A tuple of game frame and the corresponding button action. We must track the specific shoot
     * action pressed so that we can be more lenient on the with lockout code.
     */
    autofireSequenceEnded: null as [int, ButtonAction] | null,

    /**
     * Needs to tick upwards to 2 to prevent a race condition when a shoot input is pressed on the
     * second half of a game frame. (The necessity of this variable can be tested by removing it and
     * observing that some percent of the time, autofire fails to start right away after pressing
     * down a shoot button.)
     */
    startCounter: 0,

    /**
     * A map to track the past N frames of whether a shoot button was being pressed.
     *
     * Used to prevent the players who are not using the autofire feature from doing better than
     * what autofire can do.
     */
    shootHistoryMap: new DefaultMap<ButtonAction, boolean[]>(() => []),
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
    mod.setConditionalHotkey(keyboardFunc, autofireHotkeyPressed);
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    this.checkAutofireEnd();
  }

  /** We do this in the `POST_UPDATE` callback since it simplifies the code. */
  checkAutofireEnd(): void {
    const gameFrameCount = game.GetFrameCount();
    const player = Isaac.GetPlayer(); // We only consider the first player for simplicity.
    const shootActions = getShootActions(player.ControllerIndex);
    const firstShootAction = shootActions[0];

    if (firstShootAction === undefined && v.run.startCounter !== 0) {
      v.run.startCounter = 0;
    }

    if (
      firstShootAction === undefined &&
      v.run.autofireSequenceStarted !== null
    ) {
      const [_, oldButtonAction] = v.run.autofireSequenceStarted;
      v.run.autofireSequenceStarted = null;
      v.run.autofireSequenceEnded = [gameFrameCount, oldButtonAction];
    }
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
    // Handle autofire.
    if (v.run.enabled) {
      return this.inputActionPlayerShootActionAutofire(
        player,
        inputHook,
        buttonAction,
      );
    }

    // When autofire is enabled, it has a separate check to prevent spamming, so this block can
    // safely be after the autofire section.
    return this.inputActionPlayerShootActionPreventSpam(
      player,
      inputHook,
      buttonAction,
    );
  }

  inputActionPlayerShootActionAutofire(
    player: EntityPlayer,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ): boolean | float | undefined {
    // If the player is not pressing down the shoot button, then don't change any inputs.
    const actionValue = Input.GetActionValue(
      buttonAction,
      player.ControllerIndex,
    );
    if (actionValue === 0) {
      return undefined;
    }

    // The player is pressing down the shoot button. If the player has recently ended an autofire
    // sequence, force an empty input (to prevent them from spamming the button to do better than
    // autofire.)
    const gameFrameCount = game.GetFrameCount();
    const recentlyEndedAutofire =
      v.run.autofireSequenceEnded !== null &&
      v.run.autofireSequenceEnded[0] + POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY >
        gameFrameCount &&
      v.run.autofireSequenceEnded[1] === buttonAction;
    if (recentlyEndedAutofire) {
      return inputHook === InputHook.IS_ACTION_PRESSED ? false : 0;
    }

    const shouldPressKey = this.autofireShouldPressKey(
      player,
      inputHook,
      buttonAction,
    );

    if (shouldPressKey) {
      return inputHook === InputHook.IS_ACTION_PRESSED
        ? actionValue !== 0
        : actionValue;
    }

    return inputHook === InputHook.IS_ACTION_PRESSED ? false : 0;
  }

  autofireShouldPressKey(
    player: EntityPlayer,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ): boolean {
    const gameFrameCount = game.GetFrameCount();

    // If we are not currently in an autofire sequence, then this is the first poll that the player
    // has held down a shoot input. However, we need to wait for two input callbacks to fire,
    // because you have to press down a button for two render frames in order for it to register as
    // an input.
    if (v.run.autofireSequenceStarted === null) {
      if (inputHook === InputHook.IS_ACTION_PRESSED) {
        v.run.startCounter++;
      }
      if (v.run.startCounter === 2) {
        v.run.startCounter = 0;
        v.run.autofireSequenceStarted = [gameFrameCount, buttonAction];
      }

      return true;
    }

    // Otherwise, only press the input on the Nth frame.
    const framesPassedSinceAutofireSequenceStarted =
      gameFrameCount - v.run.autofireSequenceStarted[0];
    const hasPowerfulCollectible = hasCollectible(
      player,
      ...POWERFUL_COLLECTIBLE_TYPES,
    );
    const frameDelay = hasPowerfulCollectible
      ? POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY
      : NORMAL_GAME_FRAME_DELAY;

    return framesPassedSinceAutofireSequenceStarted % frameDelay === 0;
  }

  /**
   * For players who are not using autofire, prevent the shoot button from being pressed in
   * situations where players are spamming faster than autofire allows. If an illegal input is
   * detected, queue it until the next allowed frame. TODO
   */
  inputActionPlayerShootActionPreventSpam(
    player: EntityPlayer,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ): boolean | undefined {
    // We only need to record and manipulate inputs in the `InputHook.IS_ACTION_PRESSED` callback,
    // which simplifies things.
    if (inputHook !== InputHook.IS_ACTION_PRESSED) {
      return undefined;
    }

    const shootHistory = v.run.shootHistoryMap.getAndSetDefault(buttonAction);
    const onLockout = this.shouldShootBeOnLockoutToPreventSpamming(
      player,
      buttonAction,
      shootHistory,
    );

    // Even if the player is not on lockout, we must record the input so that we can track illegal
    // presses in the future.
    const lockoutInput = this.getLockoutInput(player, buttonAction, onLockout);
    shootHistory.push(lockoutInput);

    // We only want to track inputs for as long as the lockout could exist. We need to multiply by 2
    // because the array tracks inputs on render frames, not game frames.
    if (shootHistory.length > POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY * 2) {
      shootHistory.shift();
    }

    if (onLockout) {
      Isaac.DebugString(`GETTING HERE - lockout: ${game.GetFrameCount()}`);
      return lockoutInput;
    }

    return undefined;
  }

  shouldShootBeOnLockoutToPreventSpamming(
    player: EntityPlayer,
    buttonAction: ButtonAction,
    shootHistory: boolean[],
  ): boolean {
    const hasPowerfulCollectible = hasCollectible(
      player,
      ...POWERFUL_COLLECTIBLE_TYPES,
    );
    if (!hasPowerfulCollectible) {
      return false;
    }

    const vanillaInput = Input.IsActionPressed(
      buttonAction,
      player.ControllerIndex,
    );
    if (!vanillaInput) {
      return false;
    }

    const lastInput = getLastElement(shootHistory);
    if (lastInput !== false) {
      return false;
    }

    // They are trying to press a shoot input, and were not pressing a shoot input on the previous
    // frame. Thus, if the shoot history array has any true elements, there was a recent shoot
    // action.
    return shootHistory.includes(true);
  }

  /**
   * - If on lockout, returns false.
   * - If not on lockout, returns the vanilla value;
   */
  getLockoutInput(
    player: EntityPlayer,
    buttonAction: ButtonAction,
    onLockout: boolean,
  ): boolean {
    if (onLockout) {
      return false;
    }

    return Input.IsActionPressed(buttonAction, player.ControllerIndex);
  }
}

function keyboardFunc() {
  return hotkeys.autofire === -1 ? undefined : hotkeys.autofire;
}

function autofireHotkeyPressed() {
  if (!shouldCheckForGameplayInputs()) {
    return;
  }

  v.run.enabled = !v.run.enabled;
  const enabledText = v.run.enabled ? "Enabled" : "Disabled";
  setStreakText(`${enabledText} autofire.`);
}
