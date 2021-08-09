// Per-run variables
export default class GlobalsRun {
  /**
   * Whether or not to restart the run on the next frame.
   * This variable is used because the game prevents you from executing a "restart" console command
   * while in the PostGameStarted callback.
   */
  restart = false;

  roomsEntered = 0;

  /** If we have used the Esau Jr. item yet on this run. */
  usedEsauJrAtLeastOnce = false;

  /** Needed because the player does not change until one frame after Esau Jr. is activated. */
  usedEsauJrFrame = 0;

  /** If we have used Tainted Lazarus' Flip item yet on this run. */
  usedFlipAtLeastOnce = false;

  victoryLaps = 0;
}
