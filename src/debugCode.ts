import { Keyboard } from "isaac-typescript-definitions";
import {
  log,
  logVector,
  printConsole,
  saveDataManagerSetGlobal,
  setLogFunctionsGlobal,
} from "isaacscript-common";
import g from "./globals";
import { hotkeys } from "./modConfigMenu";

/** Currently, F2 is set to execute this function. */
function debugCode(_params?: string) {
  // Add code here.
  const foo = getHUDOffsetVector();
  logVector(foo);
}

/** Hotkey 1 is bound to F2. */
export function hotkey1Function(): void {
  printConsole("Hotkey 1 activated.");
  debugCode();
}

/** Hotkey 2 is bound to F3. */
export function hotkey2Function(): void {
  hotkeys.fastDropAll = Keyboard.Z;
  hotkeys.autofire = Keyboard.F;
  hotkeys.roll = Keyboard.G;

  printConsole("Test hotkeys set.");
}

export function debugFunction(params?: string): void {
  g.debug = true;
  saveDataManagerSetGlobal();
  setLogFunctionsGlobal();

  log("Entering debug function.");
  debugCode(params);
  log("Exiting debug function.");
}

function getHUDOffsetVector(): Vector {
  // Convert e.g. 0.4 to 4.
  const hudOffset = math.floor(1.0 * 10);

  // Expected values are integers between 1 and 10.
  if (hudOffset < 1 || hudOffset > 10) {
    return Vector(0, 0);
  }

  const x = hudOffset * 2;
  let y = hudOffset;
  if (y >= 4) {
    y++;
  }
  if (y >= 9) {
    y++;
  }

  return Vector(x, y);
}
