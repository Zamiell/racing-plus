import {
  ButtonAction,
  Keyboard,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  RENDER_FRAMES_PER_SECOND,
  game,
  isActionTriggeredOnAnyInput,
  isBeforeRenderFrame,
  isKeyboardPressed,
  restart,
} from "isaacscript-common";
import { mod } from "../../../../mod";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import { speedrunSetFastReset } from "../../speedrun/characterProgress/v";

const v = {
  run: {
    /** Needed for speedruns to return to the same character. */
    lastResetRenderFrame: 0,
  },
};

export class FastReset extends ConfigurableModFeature {
  configKey: keyof Config = "FastReset";
  v = v;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    this.checkResetInput();
  }

  checkResetInput(): void {
    const isPaused = game.IsPaused();

    // Disable the fast-reset feature if the console is open. (This will also disable the feature
    // when the game is paused, but that's okay as well.)
    if (isPaused) {
      return;
    }

    // Disable the fast-reset feature if the custom console is open.
    if (AwaitingTextInput === true) {
      return;
    }

    // Don't fast-reset if any modifiers are pressed (with the exception of shift, since the
    // speedrunner MasterOfPotato uses shift).
    if (
      isKeyboardPressed(Keyboard.LEFT_CONTROL) || // 341
      isKeyboardPressed(Keyboard.LEFT_ALT) || // 342
      isKeyboardPressed(Keyboard.LEFT_SUPER) || // 343
      isKeyboardPressed(Keyboard.RIGHT_CONTROL) || // 345
      isKeyboardPressed(Keyboard.RIGHT_ALT) || // 346
      isKeyboardPressed(Keyboard.RIGHT_SUPER) // 347
    ) {
      return;
    }

    // Check to see if the player has pressed the restart input. (We check all inputs instead of
    // "player.ControllerIndex" because a controller player might be using the keyboard to reset.)
    if (isActionTriggeredOnAnyInput(ButtonAction.RESTART)) {
      this.reset();
    }
  }

  reset(): void {
    const renderFrameCount = Isaac.GetFrameCount();
    const numRoomsEntered = mod.getNumRoomsEntered();

    if (
      numRoomsEntered <= 3 ||
      isBeforeRenderFrame(v.run.lastResetRenderFrame + RENDER_FRAMES_PER_SECOND)
    ) {
      // Speedrun functionality relies on knowing whether a fast-reset occurred.
      speedrunSetFastReset();
      restart();
    } else {
      // In speedruns, we want to double tap R to return reset to the same character.
      v.run.lastResetRenderFrame = renderFrameCount;
    }
  }
}
