import g from "../../../globals";
import { consoleCommand, isActionTriggeredOnAnyInput } from "../../../util";

export function postRender(): void {
  if (!g.config.fastReset) {
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
  if (g.run.roomsEntered <= 3 || isaacFrameCount <= g.run.fastResetFrame + 60) {
    // A fast reset means to reset the current character,
    // a slow/normal reset means to go back to the first character
    g.speedrun.fastReset = true;

    consoleCommand("restart");
  } else {
    // In speedruns, we want to double tap R to return reset to the same character
    g.run.fastResetFrame = isaacFrameCount;
  }
}
