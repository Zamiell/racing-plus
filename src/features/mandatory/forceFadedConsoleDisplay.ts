// Force the "faded console display" feature to be turned on, so that end-users can report bugs
// easier.
export function postGameStarted(): void {
  Options.FadedConsoleDisplay = true;
}
