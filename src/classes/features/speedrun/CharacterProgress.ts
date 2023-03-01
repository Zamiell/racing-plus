import {
  FadeoutTarget,
  ItemType,
  ModCallback,
  PickupVariant,
  PlayerType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  game,
  getCharacterName,
  log,
  ModCallbackCustom,
  removeCollectibleFromItemTracker,
  spawnPickup,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import { CUSTOM_CHALLENGES_SET } from "../../../speedrun/constantsSpeedrun";
import { speedrunResetPersistentVars } from "../../../speedrun/resetVars";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { hasErrors } from "../mandatory/misc/checkErrors/v";
import {
  isRestartingOnNextFrame,
  restartOnNextFrame,
  setRestartCharacter,
} from "../mandatory/misc/RestartOnNextFrame";
import {
  getCharacterOrder,
  hasValidCharacterOrder,
  speedrunGetFirstChosenCharacter,
} from "./changeCharOrder/v";
import { isOnFirstCharacter, v } from "./characterProgress/v";
import { isSpeedrunWithRandomCharacterOrder } from "./RandomCharacterOrder";
import {
  speedrunResetFirstCharacterVars,
  speedrunTimerCheckpointTouched,
} from "./SpeedrunTimer";

const DELAY_RENDER_FRAMES_BEFORE_STARTING_FADEOUT = 30;
const FADEOUT_SPEED = 0.0275;

/**
 * After using the `Game.Fadeout` method, we will be taken to the main menu. We can interrupt this
 * by restarting the game on the frame before the fade out ends. 69 is the latest frame that works,
 * determined via trial and error. Doing this is necessary because we do not want the player to be
 * able to reset to skip having to watch the fade out animation.
 */
const DELAY_FRAMES_AFTER_FADEOUT = 69;

/** Tainted Cain will never be in a legitimate speedrun. */
const DEFAULT_CHARACTER_ON_ERROR = PlayerType.CAIN_B;

export class CharacterProgress extends ChallengeModFeature {
  challenge = CUSTOM_CHALLENGES_SET;
  v = v;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    this.checkBeginFadeOutAfterCheckpoint();
    this.checkManualResetAtEndOfFadeout();
  }

  checkBeginFadeOutAfterCheckpoint(): void {
    const renderFrameCount = Isaac.GetFrameCount();

    if (v.run.fadeFrame === null || renderFrameCount < v.run.fadeFrame) {
      return;
    }

    // We grabbed the checkpoint, so fade out the screen before we reset.
    v.run.fadeFrame = null;
    game.Fadeout(FADEOUT_SPEED, FadeoutTarget.RESTART_RUN);
    v.run.resetFrame = renderFrameCount + DELAY_FRAMES_AFTER_FADEOUT;
  }

  checkManualResetAtEndOfFadeout(): void {
    const renderFrameCount = Isaac.GetFrameCount();

    if (v.run.resetFrame === null || renderFrameCount < v.run.resetFrame) {
      return;
    }
    v.run.resetFrame = null;

    // The screen is now black, so move us to the next character for the speedrun.
    this.setNextCharacterAndRestart();
  }

  setNextCharacterAndRestart(): void {
    v.persistent.performedFastReset = true; // Otherwise we will go back to the beginning again.
    v.persistent.characterNum++;
    restartOnNextFrame();
    log(`Speedrun: Now on character #${v.persistent.characterNum}.`);

    // Speedruns with a random character order will set the next character using its own code.
    if (!isSpeedrunWithRandomCharacterOrder()) {
      const character = getCurrentCharacter();
      setRestartCharacter(character);

      const characterName = getCharacterName(character);
      log(
        `Speedrun: Set the next character to be ${characterName} (${character}) and set to restart on the next frame.`,
      );
    }
  }

  // 34, 370
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.TROPHY)
  postPickupInitTrophy(pickup: EntityPickup): void {
    this.removeAndSpawnBigChest(pickup);
  }

  /**
   * Funnel all end-of-run decision making through code that runs on `POST_PICKUP_INIT` for Big
   * Chests.
   */
  removeAndSpawnBigChest(pickup: EntityPickup): void {
    pickup.Remove();
    spawnPickup(PickupVariant.BIG_CHEST, 0, pickup.Position);
  }

  /** Don't move to the first character of the speedrun if we die. */
  @CallbackCustom(ModCallbackCustom.POST_GAME_END_FILTER, true)
  postGameEndFilterTrue(): void {
    v.persistent.performedFastReset = true;
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    // Force them back to the first character if there are any errors.
    if (hasErrors()) {
      speedrunResetPersistentVars();
      return;
    }

    if (v.persistent.resetAllVarsOnNextReset) {
      v.persistent.resetAllVarsOnNextReset = false;
      speedrunResetPersistentVars();
    }

    const challenge = Isaac.GetChallenge();
    if (challenge !== v.persistent.currentlyPlayingChallenge) {
      v.persistent.currentlyPlayingChallenge = challenge;
      speedrunResetPersistentVars();
    }

    this.liveSplitReset();

    if (isRestartingOnNextFrame()) {
      return;
    }

    if (!hasValidCharacterOrder()) {
      return;
    }

    if (this.setCorrectCharacter()) {
      return;
    }

    if (this.goBackToFirstCharacter()) {
      return;
    }

    speedrunResetFirstCharacterVars();
  }

  liveSplitReset(): void {
    const player = Isaac.GetPlayer();

    if (v.persistent.liveSplitReset) {
      v.persistent.liveSplitReset = false;
      player.AddCollectible(CollectibleTypeCustom.RESET);
      log(
        `Reset the LiveSplit AutoSplitter by giving "Reset", item ID ${CollectibleTypeCustom.RESET}.`,
      );
      removeCollectibleFromItemTracker(CollectibleTypeCustom.RESET);
    }
  }

  /** @returns True if the current character was wrong. */
  setCorrectCharacter(): boolean {
    const player = Isaac.GetPlayer();
    const character = player.GetPlayerType();

    // Character order is explicitly handled in some seasons.
    if (isSpeedrunWithRandomCharacterOrder()) {
      return false;
    }

    const currentCharacter = getCurrentCharacter();
    if (character !== currentCharacter) {
      v.persistent.performedFastReset = true;
      restartOnNextFrame();
      setRestartCharacter(currentCharacter);
      log(
        `Restarting because we are on character ${character} and we need to be on character ${currentCharacter}.`,
      );

      return true;
    }

    return false;
  }

  goBackToFirstCharacter(): boolean {
    if (v.persistent.performedFastReset) {
      v.persistent.performedFastReset = false;
      return false;
    }

    if (isOnFirstCharacter()) {
      return false;
    }

    // They held R for a slow reset, and they are not on the first character, so they want to
    // restart from the first character.
    v.persistent.characterNum = 1;
    restartOnNextFrame();

    if (!isSpeedrunWithRandomCharacterOrder()) {
      const firstCharacter = speedrunGetFirstChosenCharacter();
      if (firstCharacter !== undefined) {
        setRestartCharacter(firstCharacter);
      }
    }

    log("Restarting because we want to start from the first character again.");

    // Tell the LiveSplit AutoSplitter to reset.
    v.persistent.liveSplitReset = true;

    return true;
  }

  @CallbackCustom(
    ModCallbackCustom.PRE_ITEM_PICKUP,
    ItemType.PASSIVE,
    CollectibleTypeCustom.CHECKPOINT,
  )
  preItemPickupCheckpoint(player: EntityPlayer): void {
    const renderFrameCount = Isaac.GetFrameCount();

    // Give them the Checkpoint custom item. (This is used by the LiveSplit auto-splitter to know
    // when to split.)
    player.AddCollectible(CollectibleTypeCustom.CHECKPOINT, 0, false);

    // Freeze the player.
    player.ControlsEnabled = false;

    // Mark to fade out after the "Checkpoint" text has displayed on the screen for a little bit.
    v.run.fadeFrame =
      renderFrameCount + DELAY_RENDER_FRAMES_BEFORE_STARTING_FADEOUT;

    speedrunTimerCheckpointTouched();
  }
}

function getCurrentCharacter(): PlayerType {
  const characterOrder = getCharacterOrder();
  if (characterOrder === undefined) {
    return DEFAULT_CHARACTER_ON_ERROR;
  }

  const arrayIndex = v.persistent.characterNum - 1;
  const character = characterOrder[arrayIndex];
  if (character === undefined) {
    return DEFAULT_CHARACTER_ON_ERROR;
  }

  return character;
}
