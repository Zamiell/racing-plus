import g from "../../../globals";
import { consoleCommand } from "../../../misc";
import {
  checkValidCharOrder,
  getCurrentCharacter,
  inSpeedrun,
} from "../speedrun";

export function checkRestartWrongCharacter(): boolean {
  if (!inSpeedrun()) {
    return false;
  }

  if (!checkValidCharOrder()) {
    // The character order is not set properly; we will display an error to the user later on
    return false;
  }

  const character = g.p.GetPlayerType();
  const characterForThisSpeedrun = getCurrentCharacter();

  if (character !== characterForThisSpeedrun) {
    consoleCommand(`restart ${characterForThisSpeedrun}`);
    return true;
  }

  return false;
}
