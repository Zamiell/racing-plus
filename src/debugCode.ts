import { Keyboard } from "isaac-typescript-definitions";
import { iRange, log, setLogFunctionsGlobal } from "isaacscript-common";
import { v } from "./features/speedrun/season4";
import { g } from "./globals";
import { mod } from "./mod";
import { hotkeys } from "./modConfigMenu";

/** Currently, F2 is set to execute this function. */
function debugCode(_params?: string) {
  // Add code here.
  // eslint-disable-next-line isaacscript/strict-enums
  v.persistent.storedCollectibles = iRange(1, 73);
}

/** Hotkey 1 is bound to F2. */
export function hotkey1Function(): void {
  print("Hotkey 1 activated.");
  debugCode();
}

/** Hotkey 2 is bound to F3. */
export function hotkey2Function(): void {
  hotkeys.fastDropAll = Keyboard.Z;
  hotkeys.autofire = Keyboard.F;
  hotkeys.storage = Keyboard.X;
  hotkeys.roll = Keyboard.G;

  print("Test hotkeys set.");
}

export function debugFunction(params?: string): void {
  g.debug = true;
  mod.saveDataManagerSetGlobal();
  setLogFunctionsGlobal();

  log("Entering debug function.");
  debugCode(params);
  log("Exiting debug function.");
}
