// TODO:
// - fix queued input causing autofire on vanilla
// - fix autofire right + down fast
// - limit IsMouseBtnPressed (pause game as penalty)

import type { ButtonAction } from "isaac-typescript-definitions";
import {
  CollectibleType,
  InputHook,
  KnifeVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  DefaultMap,
  ModCallbackCustom,
  SHOOTING_ACTIONS,
  game,
  getLastElement,
  getShootActions,
  hasCollectible,
  isShootAction,
  logError,
} from "isaacscript-common";
import { mod } from "../../../../mod";
import { hotkeys } from "../../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../../utils";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import { setStreakText } from "../../mandatory/misc/StreakText";

interface QueuedShot {
  buttonAction: ButtonAction;
  value: float;
  press: boolean;
  untilRenderFrame: int | null;
}

/** Release the key on every other frame for e.g. Anti-Gravity. */
const NORMAL_GAME_FRAME_DELAY = 2;

/**
 * It is possible to manually spam at a rate of once per 3 frames, but this results in Spirit Sword
 * and Chocolate Milk becoming too powerful. Thus, we manually enforce a 5 frame delay for those
 * collectibles.
 *
 * TODO: Change from 3 to 5 in R+7 Season 5.
 */
const POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY = 20;

const POWERFUL_COLLECTIBLE_TYPES = [
  CollectibleType.SPIRIT_SWORD,
  CollectibleType.CHOCOLATE_MILK,
] as const;

/**
 * We only want to track inputs for as long as the lockout could exist. We need to multiply by 2
 * because the array tracks inputs on render frames, not game frames. We minus two to adjust for the
 * fact that otherwise, queued shots would come out at N + 1 game frames instead of N.
 */
const SHOOT_HISTORY_SIZE = POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY * 2 - 2;

const v = {
  run: {
    enabled: false,
    gameFrameAutofireSequenceStarted: null as int | null,
    gameFrameAutofireSequenceEnded: null as int | null,
    autofireReleasedShootFrameCount: 0,

    /**
     * Needs to tick upwards to 2 to prevent a race condition when a shoot input is pressed on the
     * second half of a game frame. (The necessity of this variable can be tested by removing it and
     * observing that some percent of the time, autofire fails to start right away after pressing
     * down a shoot button.)
     */
    startCounter: 0,

    // -----

    /**
     * A map to track the past N game frames of whether a shoot button was being pressed.
     *
     * Used to prevent the players who are not using the autofire feature from doing better than
     * what autofire can do.
     */
    vanillaShootHistoryMap: new DefaultMap<ButtonAction, boolean[]>(() => []),

    /*
     * Used to prevent the players who are not using the autofire feature from doing better than
     * what autofire can do.
     */
    vanillaShootGameFrame: null as int | null,

    // ----

    /*
     * Used to prevent the players who are not using the autofire feature from doing better than
     * what autofire can do.
     */
    shootLockoutButtons: new Set<ButtonAction>(),

    /**
     * A map to track the past N render frames of whether a shoot button was being pressed.
     *
     * Used to prevent the players who are not using the autofire feature from doing better than
     * what autofire can do.
     */
    shootHistoryMap: new DefaultMap<ButtonAction, boolean[]>(() => []),

    /**
     * Used to prevent the players who are not using the autofire feature from doing better than
     * what autofire can do. (Shots are queued when they are inside of a lockout.)
     */
    queuedShot: null as QueuedShot | null,
  },
};

/**
 * We have to return a value from both the `isActionPressed` and the `getActionValue` callbacks in
 * order for Anti-Gravity autofire to work.
 */
export class Autofire extends MandatoryModFeature {
  v = v;
  private frameLastSpawned = 0;

  constructor() {
    super();

    // See the comment in the "FastDrop.ts" file about reading keyboard inputs.
    mod.setConditionalHotkey(keyboardFunc, autofireHotkeyPressed);
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    this.checkAutofireEnd();
    this.recordVanillaInputs();
    this.recordLastVanillaShootPress();
  }

  /** We do this in the `POST_UPDATE` callback since it simplifies the code. */
  checkAutofireEnd(): void {
    const gameFrameCount = game.GetFrameCount();
    const player = Isaac.GetPlayer(); // We only consider the first player for simplicity.
    const shootActions = getShootActions(player.ControllerIndex);
    const firstShootAction = shootActions[0];

    // Handle the case of a shoot input being held down for a single render frame (which is not long
    // enough to start an autofire sequence).
    if (firstShootAction === undefined && v.run.startCounter !== 0) {
      v.run.startCounter = 0;
    }

    // End an autofire sequence when all shoot inputs are released.
    if (
      firstShootAction === undefined &&
      v.run.gameFrameAutofireSequenceStarted !== null &&
      // Don't immediately end an autofire sequence when all shoot keys are released. Instead, wait
      // until the frame before the next planned fire. This is necessary to prevent autofire players
      // from spamming two different shooting buttons to shoot faster than what autofire allows and
      // to provide a consistent experience for changing shooting directions mid-autofire-sequence.
      this.autofireIsFrameBeforePress(player, gameFrameCount)
    ) {
      v.run.gameFrameAutofireSequenceStarted = null;
      v.run.gameFrameAutofireSequenceEnded = gameFrameCount;
    }
  }

  recordVanillaInputs(): void {
    const player = Isaac.GetPlayer();

    for (const buttonAction of SHOOTING_ACTIONS) {
      const pressed = Input.IsActionPressed(
        buttonAction,
        player.ControllerIndex,
      );
      const shootHistory =
        v.run.vanillaShootHistoryMap.getAndSetDefault(buttonAction);
      shootHistory.push(pressed);
      if (shootHistory.length > POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY) {
        shootHistory.shift();
      }
    }
  }

  recordLastVanillaShootPress(): void {
    const gameFrameCount = game.GetFrameCount();

    for (const buttonAction of SHOOTING_ACTIONS) {
      if (this.isNewShootPress(buttonAction)) {
        v.run.vanillaShootGameFrame = gameFrameCount;
        Isaac.DebugString(
          `GETTING HERE - v.run.vanillaShootGameFrame: ${v.run.vanillaShootGameFrame}`,
        );
      }
    }
  }

  isNewShootPress(buttonAction: ButtonAction): boolean {
    const shootHistory =
      v.run.vanillaShootHistoryMap.getAndSetDefault(buttonAction);

    const secondLastElement = shootHistory[shootHistory.length - 2];
    const lastElement = shootHistory[shootHistory.length - 1];

    return secondLastElement !== true && lastElement === true;
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
    inputHook: InputHook.IS_ACTION_PRESSED | InputHook.GET_ACTION_VALUE,
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
    /*
    return this.inputActionPlayerShootActionPreventSpam(
      player,
      inputHook,
      buttonAction,
    );
    */

    if (v.run.vanillaShootGameFrame !== null) {
      return inputHook === InputHook.IS_ACTION_PRESSED ? false : 0;
    }

    return undefined;
  }

  inputActionPlayerShootActionAutofire(
    player: EntityPlayer,
    inputHook: InputHook.IS_ACTION_PRESSED | InputHook.GET_ACTION_VALUE,
    buttonAction: ButtonAction,
  ): boolean | float | undefined {
    const gameFrameCount = game.GetFrameCount();

    // If the player is not pressing down the shoot button, then don't change any inputs.
    const pressed = Input.IsActionPressed(buttonAction, player.ControllerIndex);
    if (!pressed) {
      return undefined;
    }

    // If we are not currently in an autofire sequence, then the player is holding down a shoot
    // input and wants to enter one. However, we need to wait for two input callbacks to fire,
    // because you have to press down a button for two render frames in order for it to register as
    // an input.
    if (v.run.gameFrameAutofireSequenceStarted === null) {
      switch (inputHook) {
        case InputHook.IS_ACTION_PRESSED: {
          v.run.startCounter++;

          if (v.run.startCounter === 2) {
            v.run.startCounter = 0;
            v.run.gameFrameAutofireSequenceStarted = gameFrameCount;
          }

          return undefined; // Continue the first press. (Otherwise, it will not come out.)
        }

        case InputHook.GET_ACTION_VALUE: {
          return undefined;
        }
      }
    }

    // We are currently in an autofire sequence and the player is pressing down the shoot button to
    // continue it.
    const shouldPressKey = this.autofireShouldPressKeyOnFrame(
      player,
      gameFrameCount,
    );
    if (shouldPressKey) {
      return inputHook === InputHook.IS_ACTION_PRESSED
        ? true
        : Input.GetActionValue(buttonAction, player.ControllerIndex);
    }

    return inputHook === InputHook.IS_ACTION_PRESSED ? false : 0;
  }

  autofireShouldPressKeyOnFrame(
    player: EntityPlayer,
    gameFrameCount: int,
  ): boolean {
    if (v.run.gameFrameAutofireSequenceStarted === null) {
      return false;
    }

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

  autofireIsFrameBeforePress(
    player: EntityPlayer,
    gameFrameCount: int,
  ): boolean {
    return this.autofireShouldPressKeyOnFrame(player, gameFrameCount + 1);
  }

  /**
   * For players who are not using autofire, prevent the shoot button from being pressed in
   * situations where players are spamming faster than autofire allows and they have certain
   * powerful collectibles. If an illegal input is detected, queue it until the next allowed frame.
   */
  inputActionPlayerShootActionPreventSpam(
    player: EntityPlayer,
    inputHook: InputHook.IS_ACTION_PRESSED | InputHook.GET_ACTION_VALUE,
    buttonAction: ButtonAction,
  ): boolean | float | undefined {
    const hasPowerfulCollectible = hasCollectible(
      player,
      ...POWERFUL_COLLECTIBLE_TYPES,
    );
    if (!hasPowerfulCollectible) {
      return undefined;
    }

    switch (inputHook) {
      case InputHook.IS_ACTION_PRESSED: {
        return this.inputActionPlayerIsActionPressedPreventSpam(
          player,
          buttonAction,
        );
      }

      case InputHook.GET_ACTION_VALUE: {
        return this.inputActionPlayerGetActionValuePreventSpam(buttonAction);
      }
    }
  }

  inputActionPlayerIsActionPressedPreventSpam(
    player: EntityPlayer,
    buttonAction: ButtonAction,
  ): boolean | undefined {
    const pressed = Input.IsActionPressed(buttonAction, player.ControllerIndex);
    const shootHistory = v.run.shootHistoryMap.getAndSetDefault(buttonAction);

    // First, handle shoot lockout ending.
    if (
      v.run.shootLockoutButtons.has(buttonAction) &&
      !shootHistory.includes(true) // If there have been no presses.
    ) {
      v.run.shootLockoutButtons.delete(buttonAction);
    }

    // Second, handle shoot lockout starting. (This has to be after handling shoot lockout ending.)
    const shouldStartOrContinueLockout = this.shouldStartOrContinueLockout(
      player,
      buttonAction,
      shootHistory,
    );
    if (shouldStartOrContinueLockout) {
      v.run.shootLockoutButtons.add(buttonAction);
    }

    // Handle lockout.
    if (shouldStartOrContinueLockout) {
      // If they are pressing the input and there is not already a queued shot, add one.
      if (pressed && v.run.queuedShot === null) {
        const value = Input.GetActionValue(
          buttonAction,
          player.ControllerIndex,
        );
        v.run.queuedShot = {
          buttonAction,
          value,
          press: true,
          untilRenderFrame: null,
        };

        Isaac.DebugString(
          `GETTING HERE - added queued shot on render frame: ${Isaac.GetFrameCount()}, game frame: ${game.GetFrameCount()}`,
        );
      }

      this.recordInput(shootHistory, false);
      return false;
    }

    // Handle queued shots.
    if (
      v.run.queuedShot !== null &&
      v.run.queuedShot.buttonAction === buttonAction
    ) {
      if (v.run.queuedShot.untilRenderFrame === null) {
        const renderFrameCount = Isaac.GetFrameCount();
        v.run.queuedShot.untilRenderFrame = renderFrameCount + 2;
        Isaac.DebugString(
          `GETTING HERE - lockout ended, pressing until frame ${
            v.run.queuedShot.untilRenderFrame
          }, render frame: ${Isaac.GetFrameCount()}, game frame: ${game.GetFrameCount()}`,
        );
      }

      this.recordInput(shootHistory, v.run.queuedShot.press);
      return v.run.queuedShot.press;
    }

    // Let the vanilla input through.
    this.recordInput(shootHistory, pressed);
    return undefined;
  }

  shouldStartOrContinueLockout(
    player: EntityPlayer,
    buttonAction: ButtonAction,
    shootHistory: boolean[],
  ): boolean {
    if (v.run.shootLockoutButtons.has(buttonAction)) {
      return true;
    }

    const pressed = Input.IsActionPressed(buttonAction, player.ControllerIndex);
    if (!pressed) {
      return false;
    }

    const lastPressed = getLastElement(shootHistory);
    if (lastPressed !== false) {
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

  recordInput(shootHistory: boolean[], pressed: boolean): void {
    shootHistory.push(pressed);
    if (shootHistory.length > SHOOT_HISTORY_SIZE) {
      shootHistory.shift();
    }
  }

  inputActionPlayerGetActionValuePreventSpam(
    buttonAction: ButtonAction,
  ): float | undefined {
    // Handle lockout.
    if (v.run.shootLockoutButtons.has(buttonAction)) {
      return 0;
    }

    // Handle queued shots.
    if (
      v.run.queuedShot === null ||
      v.run.queuedShot.buttonAction !== buttonAction
    ) {
      return undefined;
    }

    const { value, press, untilRenderFrame } = v.run.queuedShot;
    if (untilRenderFrame === null) {
      logError('Failed to get the "untilRenderFrame" value for a queued shot.');
      return;
    }

    // We decrement queued shots in the `InputHook.GET_ACTION_VALUE` (2) callback because it fires
    // after the `InputHook.IS_ACTION_PRESSED` (0) callback. The progression is as follows:
    // - Press queued shot --> Release queued shot
    // - Release queued shot --> null
    const renderFrameCount = Isaac.GetFrameCount();
    if (renderFrameCount >= untilRenderFrame) {
      if (press) {
        v.run.queuedShot = {
          buttonAction,
          value: 0,
          press: false,
          untilRenderFrame: renderFrameCount + 2,
        };

        Isaac.DebugString(
          `GETTING HERE - releasing key queued shot on render frame: ${Isaac.GetFrameCount()}, game frame: ${game.GetFrameCount()}`,
        );
      } else {
        v.run.queuedShot = null;

        Isaac.DebugString(
          `GETTING HERE - remove queued shot on render frame: ${Isaac.GetFrameCount()}, game frame: ${game.GetFrameCount()}`,
        );
      }
    }

    return value;
  }

  @Callback(ModCallback.POST_PLAYER_INIT)
  debug1(player: EntityPlayer): void {
    player.AddCollectible(CollectibleType.SPIRIT_SWORD);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_KNIFE_INIT_FILTER,
    KnifeVariant.SPIRIT_SWORD,
    0,
  )
  debug2(): void {
    const { frameLastSpawned } = this;
    this.frameLastSpawned = game.GetFrameCount();

    const diff = game.GetFrameCount() - frameLastSpawned;
    Isaac.DebugString(
      `GETTING HERE - spawned sword, diff: ${diff}, render frame: ${Isaac.GetFrameCount()}, game frame: ${game.GetFrameCount()}`,
    );
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
