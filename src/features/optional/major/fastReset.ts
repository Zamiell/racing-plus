import {
  isActionTriggeredOnAnyInput,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { consoleCommand } from "../../../util";
import { speedrunSetFastReset } from "../../speedrun/v";

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

  // Don't fast-reset if any modifiers are pressed
  // (with the exception of shift, since the speedrunner MasterOfPotato uses shift)
  if (
    Input.IsButtonPressed(Keyboard.KEY_LEFT_CONTROL, 0) || // 341
    Input.IsButtonPressed(Keyboard.KEY_LEFT_ALT, 0) || // 342
    Input.IsButtonPressed(Keyboard.KEY_LEFT_SUPER, 0) || // 343
    Input.IsButtonPressed(Keyboard.KEY_RIGHT_CONTROL, 0) || // 345
    Input.IsButtonPressed(Keyboard.KEY_RIGHT_ALT, 0) || // 346
    Input.IsButtonPressed(Keyboard.KEY_RIGHT_SUPER, 0) // 347
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
  if (g.run.roomsEntered <= 3 || isaacFrameCount <= v.run.lastResetFrame + 60) {
    // Speedrun functionality relies on knowing whether or not a fast-reset occurred
    speedrunSetFastReset();

    consoleCommand("restart");
  } else {
    // In speedruns, we want to double tap R to return reset to the same character
    v.run.lastResetFrame = isaacFrameCount;
  }
}
