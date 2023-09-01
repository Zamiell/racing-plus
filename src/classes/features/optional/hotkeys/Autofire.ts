// TODO:
// - race condition where:
//  - [INFO] - Lua Debug: GETTING HERE - start lockout from vanilla keypress, 30539 --> 30554
//  - [INFO] - Lua Debug: GETTING HERE - start lockout from vanilla keypress, 30554 --> 30569
// - fix queued input causing autofire on vanilla
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
  getShootActions,
  hasCollectible,
  isShootAction,
} from "isaacscript-common";
import { mod } from "../../../../mod";
import { hotkeys } from "../../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../../utils";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import { setStreakText } from "../../mandatory/misc/StreakText";

interface Lockout {
  startGameFrame: int;
  endGameFrame: int;
  value: float;
}

interface QueuedShot {
  buttonAction: ButtonAction;
  value: float;
  gameFrame: int;
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
const POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY = 15;

const POWERFUL_COLLECTIBLE_TYPES = [
  CollectibleType.SPIRIT_SWORD,
  CollectibleType.CHOCOLATE_MILK,
] as const;

const v = {
  run: {
    // --------------------------
    // Autofire feature variables
    // --------------------------

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

    // -------------------------
    // Lockout variables (to prevent players who are not using the autofire feature from doing
    // better than what autofire can do)
    // -------------------------

    /** A map to track the past N game frames of whether a shoot button was being pressed. */
    vanillaShootHistoryMap: new DefaultMap<ButtonAction, boolean[]>(() => []),

    /** This is deliberately not reset to null so that we can reference the end frame later on. */
    lockout: null as Lockout | null,

    /** Shots are queued when they are inside of a lockout. */
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
    const player = Isaac.GetPlayer(); // We only consider the first player for simplicity.

    this.checkAutofireEnd(player);
    this.recordVanillaInputs(player);
    this.checkLockoutStart(player);
    this.checkQueueShot(player);
  }

  /** We do this in the `POST_UPDATE` callback since it simplifies the code. */
  checkAutofireEnd(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
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

  recordVanillaInputs(player: EntityPlayer): void {
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

  checkLockoutStart(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();

    // Don't do anything if we are already in lockout.
    if (v.run.lockout !== null && gameFrameCount < v.run.lockout.endGameFrame) {
      return;
    }

    for (const buttonAction of SHOOTING_ACTIONS) {
      if (this.isNewShootPress(buttonAction)) {
        v.run.lockout = {
          startGameFrame: gameFrameCount,
          endGameFrame: gameFrameCount + POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY,
          value: Input.GetActionValue(buttonAction, player.ControllerIndex),
        };
        Isaac.DebugString(
          `GETTING HERE - start lockout from vanilla keypress, ${v.run.lockout.startGameFrame} --> ${v.run.lockout.endGameFrame}`,
        );
        return;
      }
    }
  }

  checkQueueShot(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();

    // Don't do anything if we are not in a lockout.
    if (
      v.run.lockout === null ||
      gameFrameCount >= v.run.lockout.endGameFrame
    ) {
      return;
    }

    // Don't do anything if the lockout started on this frame.
    if (v.run.lockout.startGameFrame === gameFrameCount) {
      return;
    }

    // Don't do anything if we have already queued a shot.
    if (v.run.queuedShot !== null) {
      return;
    }

    for (const buttonAction of SHOOTING_ACTIONS) {
      if (this.isNewShootPress(buttonAction)) {
        v.run.queuedShot = {
          buttonAction,
          value: Input.GetActionValue(buttonAction, player.ControllerIndex),
          gameFrame: v.run.lockout.endGameFrame,
        };
        Isaac.DebugString(
          `GETTING HERE - added queued shot, render frame: ${Isaac.GetFrameCount()}, game frame: ${gameFrameCount}`,
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
    return this.inputActionPlayerShootActionPreventSpam(
      player,
      inputHook,
      buttonAction,
    );
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

    // We must handle queued shots before lockout because as soon as a queued shot is applied, we
    // also enter a lockout. Additionally, we must hold down a shoot input for at least two polls in
    // order for it to be picked up by the game.
    const gameFrameCount = game.GetFrameCount();

    // Handle queued shots.
    /*
    if (
      v.run.queuedShot !== null &&
      v.run.queuedShot.buttonAction === buttonAction
    ) {
      if (gameFrameCount === v.run.queuedShot.gameFrame) {
        v.run.lockoutStartGameFrame = gameFrameCount;
        v.run.lockoutEndGameFrame =
          gameFrameCount + POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY;

        Isaac.DebugString(
          `DOING QUEUED SHOT INPUT on render frame: ${Isaac.GetFrameCount()}, game frame: ${gameFrameCount}`,
        );
        return inputHook === InputHook.IS_ACTION_PRESSED
          ? true
          : v.run.queuedShot.value;
      }

      if (gameFrameCount > v.run.queuedShot.gameFrame) {
        v.run.queuedShot = null;
      }
    }
    */

    // Handle lockout (which is when we force the shoot button to be pressed).
    if (v.run.lockout !== null && gameFrameCount < v.run.lockout.endGameFrame) {
      // There is one special case, which is when 1) we are on the frame before lockout ends and 2)
      // the player does not have the button held. In this case, we want to release the button so
      // that the player can activate a new shot on the specific frame that lockout ends. (We can't
      // unconditionally release the key because that would remove the vanilla ability to charge
      // up.)
      if (gameFrameCount === v.run.lockout.endGameFrame - 1) {
        const pressed = Input.IsActionPressed(
          buttonAction,
          player.ControllerIndex,
        );
        if (!pressed) {
          return inputHook === InputHook.IS_ACTION_PRESSED ? false : 0;
        }
      }

      return inputHook === InputHook.IS_ACTION_PRESSED ? true : 1;
    }

    return undefined;
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
      `GETTING HERE - spawned sword, DIFF: ${diff}, render frame: ${Isaac.GetFrameCount()}, game frame: ${game.GetFrameCount()}`,
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
