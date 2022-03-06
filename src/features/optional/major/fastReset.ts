import {
  isActionTriggeredOnAnyInput,
  isKeyboardPressed,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { restart } from "../../../utils";
import { speedrunSetFastReset } from "../../speedrun/exported";
import { getRoomsEntered } from "../../utils/roomsEntered";

const v = {
  run: {
    /** Needed for speedruns to return to the same character. */
    lastResetFrame: 0,
  },
};

export function init(): void {
  saveDataManager("fastReset", v, featureEnabled);
}

function featureEnabled() {
  return config.fastReset;
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!config.fastReset) {
    return;
  }

  checkResetInput();
}

// Check for fast-reset inputs
function checkResetInput() {
  const isPaused = g.g.IsPaused();

  // Disable the fast-reset feature if the console is open
  // (this will also disable the feature when the game is paused, but that's okay as well)
  if (isPaused) {
    return;
  }

  // Disable the fast-reset feature if the custom console is open
  if (AwaitingTextInput) {
    return;
  }

  // Don't fast-reset if any modifiers are pressed
  // (with the exception of shift, since the speedrunner MasterOfPotato uses shift)
  if (
    isKeyboardPressed(Keyboard.KEY_LEFT_CONTROL) || // 341
    isKeyboardPressed(Keyboard.KEY_LEFT_ALT) || // 342
    isKeyboardPressed(Keyboard.KEY_LEFT_SUPER) || // 343
    isKeyboardPressed(Keyboard.KEY_RIGHT_CONTROL) || // 345
    isKeyboardPressed(Keyboard.KEY_RIGHT_ALT) || // 346
    isKeyboardPressed(Keyboard.KEY_RIGHT_SUPER) // 347
  ) {
    return;
  }

  // Check to see if the player has pressed the restart input
  // (we check all inputs instead of "player.ControllerIndex" because
  // a controller player might be using the keyboard to reset)
  if (isActionTriggeredOnAnyInput(ButtonAction.ACTION_RESTART)) {
    reset();
  }
}

function reset() {
  const isaacFrameCount = Isaac.GetFrameCount();
  const roomsEntered = getRoomsEntered();

  if (roomsEntered <= 3 || isaacFrameCount <= v.run.lastResetFrame + 60) {
    // Speedrun functionality relies on knowing whether or not a fast-reset occurred
    speedrunSetFastReset();
    restart();
  } else {
    // In speedruns, we want to double tap R to return reset to the same character
    v.run.lastResetFrame = isaacFrameCount;
  }
}
