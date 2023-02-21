import {
  ButtonAction,
  Keyboard,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  game,
  isActionTriggeredOnAnyInput,
  isKeyboardPressed,
  restart,
} from "isaacscript-common";
import { speedrunSetFastReset } from "../../../../features/speedrun/v";
import { getNumRoomsEntered } from "../../../../features/utils/numRoomsEntered";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const v = {
  run: {
    /** Needed for speedruns to return to the same character. */
    lastResetFrame: 0,
  },
};

export class FastReset extends ConfigurableModFeature {
  configKey: keyof Config = "fastReset";
  v = v;

  @Callback(ModCallback.POST_RENDER) // 2
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
    const numRoomsEntered = getNumRoomsEntered();

    if (numRoomsEntered <= 3 || renderFrameCount <= v.run.lastResetFrame + 60) {
      // Speedrun functionality relies on knowing whether or not a fast-reset occurred.
      speedrunSetFastReset();
      restart();
    } else {
      // In speedruns, we want to double tap R to return reset to the same character.
      v.run.lastResetFrame = renderFrameCount;
    }
  }
}
