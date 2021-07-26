import { restartAsCharacter } from "../../../misc";
import {
  checkValidCharOrder,
  getCurrentCharacter,
  inSpeedrun,
} from "../speedrun";

export function checkRestartWrongSpeedrunCharacter(): boolean {
  if (!inSpeedrun()) {
    return false;
  }

  if (!checkValidCharOrder()) {
    // The character order is not set properly; we will display an error to the user later on
    return false;
  }

  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const characterForThisSpeedrun = getCurrentCharacter();

  if (character === characterForThisSpeedrun) {
    return false;
  }

  restartAsCharacter(characterForThisSpeedrun);
  return true;
}
