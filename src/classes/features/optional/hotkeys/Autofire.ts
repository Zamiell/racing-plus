import {
  ButtonAction,
  CollectibleType,
  InputHook,
  ModCallback,
  Mouse,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  DefaultMap,
  ModCallbackCustom,
  ReadonlySet,
  SHOOTING_BUTTON_ACTIONS,
  game,
  getShootButtonActions,
  hasCollectible,
  isShootAction,
  sfxManager,
} from "isaacscript-common";
import { mod } from "../../../../mod";
import { hotkeys } from "../../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../../utils";
import { isRandomBaby } from "../../../../utilsBabiesMod";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import { setStreakText } from "../../mandatory/misc/StreakText";

interface Lockout {
  buttonAction: ButtonAction;
  value: float;
  startGameFrame: int;
  endGameFrame: int;
  playerReleasedKey: boolean;
}

interface QueuedShot {
  buttonAction: ButtonAction;
  value: float;
  gameFrame: int;
}

/** Release the key on every other frame for e.g. Anti-Gravity. */
const NORMAL_GAME_FRAME_DELAY = 2;

/**
 * It is possible to manually spam at a rate of around once per 3 frames, but this results in Spirit
 * Sword and Chocolate Milk becoming too powerful. Thus, we manually enforce a 4 frame delay for
 * those collectibles.
 */
const POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY = 4;

const POWERFUL_COLLECTIBLE_TYPES = [
  CollectibleType.SPIRIT_SWORD,
  CollectibleType.CHOCOLATE_MILK,
] as const;

const ANTI_SYNERGY_BABIES = new ReadonlySet([
  115, // Masked Baby - Can't shoot while moving
  386, // Imp Baby - Blender + flight + explosion immunity + blindfolded
  531, // Solomon's Baby A - Can't shoot right
  532, // Solomon's Baby B - Can't shoot left
]);

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

    /**
     * An array to track the past N game frames of whether the left mouse button was being pressed.
     */
    leftMouseHistory: [] as boolean[],

    /** This is deliberately not reset to null so that we can reference the end frame later on. */
    lockout: null as Lockout | null,

    /** Shots are queued when they are inside of a lockout. */
    queuedShot: null as QueuedShot | null,

    /** Whether to pause the game in the next `INPUT_ACTION` callback. */
    queuePause: false,
  },
};

/**
 * We have to return a value from both the `isActionPressed` and the `getActionValue` callbacks in
 * order for Anti-Gravity autofire to work.
 */
export class Autofire extends MandatoryModFeature {
  v = v;
  private readonly frameLastSpawned = 0;

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
    this.checkMouseSpam();
  }

  /** We do this in the `POST_UPDATE` callback since it simplifies the code. */
  checkAutofireEnd(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    const shootButtonActions = getShootButtonActions(player.ControllerIndex);
    const firstShootButtonAction = shootButtonActions[0];

    // Handle the case of a shoot input being held down for a single render frame (which is not long
    // enough to start an autofire sequence).
    if (firstShootButtonAction === undefined && v.run.startCounter !== 0) {
      v.run.startCounter = 0;
    }

    // End an autofire sequence when all shoot inputs are released.
    if (
      firstShootButtonAction === undefined &&
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

  /** Records shoot buttons and the left mouse button. */
  recordVanillaInputs(player: EntityPlayer): void {
    for (const buttonAction of SHOOTING_BUTTON_ACTIONS) {
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

    const leftMousePressed = Input.IsMouseBtnPressed(Mouse.BUTTON_LEFT);
    v.run.leftMouseHistory.push(leftMousePressed);
    if (v.run.leftMouseHistory.length > POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY) {
      v.run.leftMouseHistory.shift();
    }
  }

  checkLockoutStart(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();

    // Don't do anything if we are already in lockout.
    if (v.run.lockout !== null && gameFrameCount < v.run.lockout.endGameFrame) {
      return;
    }

    for (const buttonAction of SHOOTING_BUTTON_ACTIONS) {
      if (this.isNewShootPress(buttonAction)) {
        v.run.lockout = {
          buttonAction,
          value: Input.GetActionValue(buttonAction, player.ControllerIndex),
          startGameFrame: gameFrameCount,
          endGameFrame: gameFrameCount + POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY,
          playerReleasedKey: false,
        };

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

    for (const buttonAction of SHOOTING_BUTTON_ACTIONS) {
      if (this.isNewShootPress(buttonAction)) {
        v.run.queuedShot = {
          buttonAction,
          value: Input.GetActionValue(buttonAction, player.ControllerIndex),
          gameFrame: v.run.lockout.endGameFrame,
        };
      }
    }
  }

  /**
   * It is only a new shoot press when:
   * - We were not pressing any shoot keys on the previous frame.
   * - We are pressing a shoot key on this frame.
   */
  isNewShootPress(buttonAction: ButtonAction): boolean {
    const shootHistory =
      v.run.vanillaShootHistoryMap.getAndSetDefault(buttonAction);
    const lastElement = shootHistory.at(-1);

    return !this.wasPressingAnyShootKeysLastFrame() && lastElement === true;
  }

  wasPressingAnyShootKeysLastFrame(): boolean {
    return SHOOTING_BUTTON_ACTIONS.some((buttonAction) => {
      const shootHistory =
        v.run.vanillaShootHistoryMap.getAndSetDefault(buttonAction);
      const secondLastElement = shootHistory.at(-2);
      return secondLastElement === true;
    });
  }

  /**
   * It is possible to use the mouse button to spam very fast. Unfortunately, it is not possible to
   * modify mouse inputs using the normal input callbacks provided by the game. Thus, we cannot
   * prevent mouse spam in the same way that we can prevent normal shoot button spam. As a
   * workaround, pause the game to punish the player if mouse spam is detected.
   */
  checkMouseSpam(): void {
    if (v.run.queuePause) {
      return;
    }

    const numPresses = this.countTrueAfterFalse(v.run.leftMouseHistory);
    if (numPresses > 1) {
      v.run.queuePause = true;
    }
  }

  countTrueAfterFalse(array: boolean[]): int {
    let num = 0;

    for (let i = 0; i < array.length; i++) {
      const previousElement = array[i - 1];
      const element = array[i];

      if (previousElement === false && element === true) {
        num++;
      }
    }

    return num;
  }

  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_FILTER,
    InputHook.IS_ACTION_TRIGGERED,
    ButtonAction.PAUSE,
  )
  inputActionPause(): boolean | undefined {
    if (v.run.queuePause) {
      v.run.queuePause = false;

      // We need to reset the history array. (Otherwise the game will be paused again the moment the
      // player unpauses.)
      v.run.leftMouseHistory = [];

      // Play a sound effect to let the player know that pausing is intentional.
      sfxManager.Play(SoundEffect.BOSS_2_INTRO_ERROR_BUZZ);

      return true;
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.INPUT_ACTION_PLAYER)
  inputActionPlayer(
    player: EntityPlayer,
    inputHook: InputHook,
    buttonAction: ButtonAction,
  ): boolean | float | undefined {
    // Early return if we are on some specific babies from The Babies Mod.
    if (
      isRandomBaby(player) &&
      BabiesModBabyType !== undefined &&
      ANTI_SYNERGY_BABIES.has(BabiesModBabyType)
    ) {
      return undefined;
    }

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
    if (
      v.run.queuedShot !== null &&
      v.run.queuedShot.buttonAction === buttonAction
    ) {
      if (gameFrameCount === v.run.queuedShot.gameFrame) {
        v.run.lockout = {
          buttonAction,
          startGameFrame: gameFrameCount,
          endGameFrame: gameFrameCount + POWERFUL_COLLECTIBLE_GAME_FRAME_DELAY,
          value: v.run.queuedShot.value,
          playerReleasedKey: false,
        };

        return inputHook === InputHook.IS_ACTION_PRESSED
          ? true
          : v.run.queuedShot.value;
      }

      if (gameFrameCount > v.run.queuedShot.gameFrame) {
        v.run.queuedShot = null;
      }
    }

    // Handle lockout.
    if (v.run.lockout !== null && gameFrameCount < v.run.lockout.endGameFrame) {
      // First, handle the case where the player has released the key that is supposed to be held
      // down by lockout. (Once they release the key, all shoot buttons will be forced to false/0.)
      if (buttonAction === v.run.lockout.buttonAction) {
        const pressed = Input.IsActionPressed(
          buttonAction,
          player.ControllerIndex,
        );
        if (!pressed) {
          v.run.lockout.playerReleasedKey = true;
        }
      }

      // We force the shoot button that started the lockout to be pressed (unless the player
      // released the key already) and all other shoot buttons to be released.
      const press =
        buttonAction === v.run.lockout.buttonAction &&
        !v.run.lockout.playerReleasedKey;
      const value = press ? v.run.lockout.value : 0;

      return inputHook === InputHook.IS_ACTION_PRESSED ? press : value;
    }

    return undefined;
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
