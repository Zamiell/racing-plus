export function checkRestartWrongCharacter(): boolean {
  /*
  // The "restart" command takes an optional argument to specify the character;
  // we might want to specify this
  if (inSpeedrun()) {
    const currentChar = speedrun.getCurrentCharacter();
    if (!speedrun.checkValidCharOrder()) {
      // The character order is not set properly; we will display an error to the user later on
      return;
    }
    command = `${command} ${currentChar}`;
  } else if (g.race.status !== "none" && g.race.rFormat !== "custom") {
    // Custom races might switch between characters
    command = `${command} ${g.race.character}`;
  }
  */

  return false;
}
