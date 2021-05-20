import g from "../globals";
import { consoleCommand, isActionTriggered } from "../misc";

export function postRender(): void {
  if (!g.config.fastReset) {
    return;
  }

  checkConsoleInput();
  checkResetInput();
}

// Keep track that we opened the console on this run so that we can disable the fast-resetting
// feature (so that typing an "r" into the console does not cause a fast-reset)
function checkConsoleInput() {
  // We don't need to perform any additional checks if we have already opened the console on this
  // run
  if (g.run.fastReset.consoleOpened) {
    return;
  }

  // Check to see if the player is opening the console
  if (Input.IsButtonTriggered(Keyboard.KEY_GRAVE_ACCENT, 0)) {
    g.run.fastReset.consoleOpened = true;
    Isaac.DebugString("The console was opened for the first time on this run.");
  }
}

// Check for fast-reset inputs
function checkResetInput() {
  // Disable the fast-reset feature if we have opened the console on this run
  // (so that typing an "r" into the console does not cause a fast-reset)
  if (g.run.fastReset.consoleOpened) {
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
  if (!isActionTriggered(ButtonAction.ACTION_RESTART)) {
    return;
  }

  reset();
}

function reset() {
  const isaacFrameCount = Isaac.GetFrameCount();
  if (
    g.run.roomsEntered <= 3 ||
    isaacFrameCount <= g.run.fastReset.frame + 60
  ) {
    // A fast reset means to reset the current character,
    // a slow/normal reset means to go back to the first character
    g.speedrun.fastReset = true;

    consoleCommand("restart");
  } else {
    // In speedruns, we want to double tap R to return reset to the same character
    g.run.fastReset.frame = isaacFrameCount;
  }
}
